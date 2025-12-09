using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;
using System.IO;
using System;

namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]
    public class WaterSensorTests
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
        public void WaterSensor_CoolDownEnabled_ConsumesExtraWater()
        {
            // Arrange: File 0. CoolDown (-15).
            File.WriteAllText(Path.Combine(TestDirectory, "WaterLevels.dat"), "0");
            _mockStatuses.CoolDownAtNight = true;
            _mockStatuses.WaterLevel = 100f;
            var device = new WaterSensor(_mockStatuses);

            // Act
            var result = device.QueryLatest();

            // Assert: 100 - 15 = 85
            Assert.AreEqual(85f, result.currentValue);
        }
    }
}
