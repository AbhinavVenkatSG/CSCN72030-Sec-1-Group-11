using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;
using System.IO;
using System;

namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]
    public class O2ScrubberTests
    {
        private const string TestDirectory = "SensorEmulationFiles";
        
        private BunkerStatuses _mockStatuses = null!;

        [TestInitialize]
        public void Setup()
        {
            if (Directory.Exists(TestDirectory))
            {
                GC.Collect();
                GC.WaitForPendingFinalizers();
                Directory.Delete(TestDirectory, true);
            }
            Directory.CreateDirectory(TestDirectory);
            _mockStatuses = new BunkerStatuses();
        }

        [TestCleanup]
        public void Cleanup()
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();
            if (Directory.Exists(TestDirectory)) Directory.Delete(TestDirectory, true);
        }

        [TestMethod]
        public void O2Scrubber_HighPower_BoostsOxygen()
        {
            // Arrange
            // 1. We write "-50" to the file. 
            // Reason: The device internally starts at 100.
            // Without a drop, 100 + 20 boost = 120 (clamped to 100), which looks like no change.
            File.WriteAllText(Path.Combine(TestDirectory, "OxygenLevels.dat"), "-50");
            
            _mockStatuses.O2ScrubberPower = 100; // 100% Power adds +20 Boost
            _mockStatuses.GasolineLevel = 50;    // We have gas, so boost is active
            
            // Device internal state starts at 100
            var device = new O2Scrubber(_mockStatuses);

            // Act
            var result = device.QueryLatest();

            // Assert Calculation:
            // Start Internal: 100
            // File Drop:     -50
            // Boost:         +20 (because Power is 100%)
            // Net Change:    -30
            // Final Result:   70
            Assert.AreEqual(70f, result.currentValue, "Expected 100 (Start) - 50 (File) + 20 (Boost) = 70");
        }
    }
}
