using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;
using System.IO;
using System;

namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]
    public class DosimeterTests
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
        public void Dosimeter_ReadsValue_UpdatesStatusCorrectly()
        {
            // Arrange
            string path = Path.Combine(TestDirectory, "RadiationLevels.dat");
            File.WriteAllText(path, "15.5");
            var device = new Dosimeter(_mockStatuses);

            // Act
            var result = device.QueryLatest();

            // Assert
            Assert.AreEqual(15.5f, result.currentValue);
            Assert.AreEqual(15.5f, _mockStatuses.RadiationLevel);
            Assert.AreEqual(DeviceType.Dosimeter, result.type);
        }
    }
}
