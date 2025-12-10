using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;
using System.IO;
using System; // Required for GC

namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]//test
    public class GeneratorTests
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
        public void Cleanup()//test
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();

            if (Directory.Exists(TestDirectory))
            {
                Directory.Delete(TestDirectory, true);
            }
        }

        [TestMethod]
        public void Generator_BelowThreshold_TurnsOffLights()
        {
            // Arrange
            string path = Path.Combine(TestDirectory, "GasolineLevels.dat");
            File.WriteAllText(path, "-60"); 

            // Initialize global state
            _mockStatuses.GasolineLevel = 100f; 
            _mockStatuses.LightsOnThreshold = 50;

            // Instantiate device (which opens the file)
            var device = new Generator(_mockStatuses);

            // Act
            device.QueryLatest();

            // Assert
            Assert.AreEqual(40f, _mockStatuses.GasolineLevel, "Gas should drop to 40 (100 - 60)");
            Assert.IsFalse(_mockStatuses.LightsOn, "Lights should be OFF because 40 < 50");
        }
    }
}
