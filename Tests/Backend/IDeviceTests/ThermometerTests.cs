using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;
using System.IO;
using System;

namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]
    public class ThermometerTests
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

            if (Directory.Exists(TestDirectory))
            {
                Directory.Delete(TestDirectory, true);
            }
        }

        [TestMethod]
        public void Thermometer_ReadsValue_UpdatesStatusCorrectly()
        {
            // Arrange
            string path = Path.Combine(TestDirectory, "Temperature.dat");
            File.WriteAllText(path, "25.5");
            var device = new Thermometer(_mockStatuses);

            // Act
            var result = device.QueryLatest();

            // Assert
            Assert.AreEqual(25.5f, result.currentValue, "Device should return value from file.");
            Assert.AreEqual(25.5f, _mockStatuses.Temperature, "Device should update global BunkerStatuses.");
            Assert.AreEqual(DeviceType.Thermometer, result.type, "Device type should be Thermometer.");
        }
    }
}
