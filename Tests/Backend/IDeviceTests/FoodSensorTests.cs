using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;
using System.IO;
using System;

namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]
    public class FoodSensorTests
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
        public void FoodSensor_LowRations_HalvesUsage()
        {
            // Arrange: File usage -10. Low ration (0.5x) -> -5.
            File.WriteAllText(Path.Combine(TestDirectory, "FoodLevels.dat"), "-10");
            _mockStatuses.RationStatus = 1; 
            _mockStatuses.FoodLevel = 100f;
            var device = new FoodSensor(_mockStatuses);

            // Act
            var result = device.QueryLatest();

            // Assert: 100 - 5 = 95
            Assert.AreEqual(95f, result.currentValue);
        }

        [TestMethod]
        public void FoodSensor_Scavenging_AddsBonus()
        {
            // Arrange: File -10. Scavenge adds +15 minimum. Net change > +5.
            File.WriteAllText(Path.Combine(TestDirectory, "FoodLevels.dat"), "-10");
            _mockStatuses.RationStatus = 2; 
            _mockStatuses.IsScavenging = true;
            _mockStatuses.FoodLevel = 50f; // Start mid-way so we can see increase
            var device = new FoodSensor(_mockStatuses);

            // Act
            var result = device.QueryLatest();

            // Assert: Should be > 50 (50 - 10 + 15 = 55 min)
            Assert.IsTrue(result.currentValue > 50f);
        }
    }
}
