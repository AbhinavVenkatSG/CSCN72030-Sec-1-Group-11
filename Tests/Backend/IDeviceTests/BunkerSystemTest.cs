using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Controllers;
using FalloutBunkerManager.Devices;
using FalloutBunkerManager;
using System.IO;
using System;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
//test
namespace FalloutBunkerManager.Tests.Backend.ControllerTests
{
    [TestClass]
    public class BunkerSystemTests
    {
        private const string TestDirectory = "SensorEmulationFiles";
        
        // System Components
        private BunkerStatuses _globalState = null!;
        private DeviceNetwork _deviceNetwork = null!;
        private BunkerStatusController _commandController = null!;
        private DeviceController _queryController = null!;

        [TestInitialize]
        public void Setup()
        {
            // 1. Clean File System (Safe Delete)
            SafeDeleteDirectory(TestDirectory);
            Directory.CreateDirectory(TestDirectory);

            // 2. Create Default Dummy Files (All 0)
            var files = new[] { 
                "Temperature.dat", "FoodLevels.dat", "WaterLevels.dat", 
                "GasolineLevels.dat", "OxygenLevels.dat", "HealthLevels.dat", 
                "RadiationLevels.dat" 
            };
            foreach (var file in files) File.WriteAllText(Path.Combine(TestDirectory, file), "0");

            // 3. Instantiate the Full Stack (This OPENS the files)
            _globalState = new BunkerStatuses();
            _deviceNetwork = new DeviceNetwork(_globalState);
            _commandController = new BunkerStatusController(_globalState);
            _queryController = new DeviceController(_deviceNetwork);
        }

        [TestCleanup]
        public void Cleanup()
        {
            // Kill references
            _deviceNetwork = null!;
            _queryController = null!;
            _commandController = null!;
            
            // Force Close Files
            GC.Collect();
            GC.WaitForPendingFinalizers();

            // Delete Files
            SafeDeleteDirectory(TestDirectory);
        }

        private void SafeDeleteDirectory(string path)
        {
            if (!Directory.Exists(path)) return;

            for (int i = 0; i < 5; i++)
            {
                try
                {
                    Directory.Delete(path, true);
                    return;
                }
                catch (IOException) { Thread.Sleep(50); GC.Collect(); GC.WaitForPendingFinalizers(); }
                catch (UnauthorizedAccessException) { Thread.Sleep(50); }
            }
        }

        // --- TEST CASE 1 ---
        [TestMethod]
        public void API_SetRationLevel_UpdatesGlobalState()
        {
            var request = new BunkerStatusController.RationLevelRequest { Level = "High" };
            var result = _commandController.SetRationLevel(request) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(3, _globalState.RationStatus);
        }

        // --- TEST CASE 2 ---
        [TestMethod]
        public void API_GetAll_ReturnsAllDevices()
        {
            var result = _queryController.GetAll();
            var okResult = result.Result as OkObjectResult;
            var statuses = okResult?.Value as DeviceStatus[];
            Assert.IsNotNull(statuses);
            Assert.AreEqual(7, statuses.Length);
        }

        // --- TEST CASE 3 (The Fix is Here) ---
        [TestMethod]
        public void System_TurnOffLights_AffectsGeneratorReading()
        {
            // 1. CRITICAL: KILL THE SETUP INSTANCE FIRST
            _deviceNetwork = null!;
            _queryController = null!;
            _commandController = null!;
            
            // Force Windows to release the file locks
            GC.Collect();
            GC.WaitForPendingFinalizers();

            // 2. NOW it is safe to overwrite the files for our specific scenario
            // Create "Low Gas" (-60)
            File.WriteAllText(Path.Combine(TestDirectory, "GasolineLevels.dat"), "-60");
            
            // Ensure other files exist (since we are about to reboot the network)
            var files = new[] { "Temperature.dat", "FoodLevels.dat", "WaterLevels.dat", "OxygenLevels.dat", "HealthLevels.dat", "RadiationLevels.dat" };
            foreach (var file in files) 
            {
                if (!File.Exists(Path.Combine(TestDirectory, file)))
                    File.WriteAllText(Path.Combine(TestDirectory, file), "0");
            }

            // 3. Re-Instantiate the System (Re-open files)
            _globalState = new BunkerStatuses();
            _globalState.GasolineLevel = 100f; // Start high
            
            _deviceNetwork = new DeviceNetwork(_globalState);
            _queryController = new DeviceController(_deviceNetwork);
            _commandController = new BunkerStatusController(_globalState);

            // 4. Run the Test Logic
            // User sets Light Threshold to 80%
            _commandController.SetLightThreshold(new BunkerStatusController.ThresholdRequest { Percent = 80 });

            // Trigger Update Cycle
            _queryController.GetAll();

            // Assert
            // Gas: 100 - 60 = 40.
            // Threshold: 80.
            // 40 < 80, so Lights should be OFF.
            Assert.AreEqual(40f, _globalState.GasolineLevel, "Gas level check failed");
            Assert.IsFalse(_globalState.LightsOn, "Lights should be OFF because Gas(40) < Threshold(80)");
        }
    }
}
