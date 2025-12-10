

using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;
using System.IO;

namespace IDeviceTests
{
    [TestClass]
    public class DeviceFileReadTests
    {
        private readonly string sensorFolder = Path.Combine(AppContext.BaseDirectory, "SensorEmulationFiles");
        private readonly BunkerStatuses bunkerStatuses = new();

        [TestMethod]
        public void ThermometerFile_Readable()
        {
            var thermometer = new Thermometer(bunkerStatuses);
            Assert.IsTrue(File.Exists(Path.Combine(sensorFolder, "Temperature.dat")));
        }

        [TestMethod]
        public void WaterSensorFile_Readable()
        {
            var waterSensor = new WaterSensor(bunkerStatuses);
            Assert.IsTrue(File.Exists(Path.Combine(sensorFolder, "WaterLevels.dat")));
        }

        [TestMethod]
        public void O2ScrubberFile_Readable()
        {
            var o2Scrubber = new O2Scrubber(bunkerStatuses);
            Assert.IsTrue(File.Exists(Path.Combine(sensorFolder, "OxygenLevels.dat")));
        }

        [TestMethod]
        public void FoodSensorFile_Readable()
        {
            var foodSensor = new FoodSensor(bunkerStatuses);
            Assert.IsTrue(File.Exists(Path.Combine(sensorFolder, "FoodLevels.dat")));
        }

        [TestMethod]
        public void GeneratorFile_Readable()
        {
            var generator = new Generator(bunkerStatuses);
            Assert.IsTrue(File.Exists(Path.Combine(sensorFolder, "GasolineLevels.dat")));
        }

        [TestMethod]
        public void HealthMonitorFile_Readable()
        {
            var healthMonitor = new HealthMonitor(bunkerStatuses);
            Assert.IsTrue(File.Exists(Path.Combine(sensorFolder, "HealthLevels.dat")));
        }

        [TestMethod]
        public void DosimeterFile_Readable()
        {
            var dosimeter = new Dosimeter(bunkerStatuses);
            Assert.IsTrue(File.Exists(Path.Combine(sensorFolder, "RadiationLevels.dat")));
        }
    }
}
