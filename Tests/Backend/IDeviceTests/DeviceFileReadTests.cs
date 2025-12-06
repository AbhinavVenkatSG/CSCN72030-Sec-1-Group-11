using FalloutBunkerManager.Devices;
using System.IO;

namespace IDeviceTests
{
    [TestClass]
    public class DeviceFileReadTests
    {
        private readonly string sensorFolder = Path.Combine(AppContext.BaseDirectory, "SensorEmulationFiles");
        private readonly BunkerStatuses bunkerStatuses = new();

        // Verify that the Thermometer is reading the correct value from the file
        [TestMethod]
        public void Thermometer_QueryLatestTest()
        {
            // Arrange
            Thermometer t = new Thermometer();

            // Act
            int temp = t.QueryLatest();

            // Assert
            Assert.IsTrue(temp == 22, "Thermometer did not read the expected value 22.");
        }

        // Verify that consecutive Thermometer updates read two different correct values
        [TestMethod]
        public void Thermometer_UpdateTest()
        {
            // Arrange
            Thermometer t = new Thermometer();

            // Act
            int temp1 = t.QueryLatest();
            int temp2 = t.QueryLatest();

            // Assert
            Assert.IsTrue(temp1 == 22, "Thermometer first read should be 22.");
            Assert.IsTrue(temp2 == 24, "Thermometer second read should be 24.");
        }

        // Verify that the Dosimeter reads the correct initial radiation value
        [TestMethod]
        public void Dosimeter_QueryLatestTest()
        {
            // Arrange
            Dosimeter d = new Dosimeter();

            // Act
            int rad = d.QueryLatest();

            // Assert
            Assert.IsTrue(rad == 45, "Dosimeter did not read the expected value 45.");
        }

        // Verify that the Dosimeter updates correctly after multiple queries
        [TestMethod]
        public void Dosimeter_UpdateTest()
        {
            // Arrange
            Dosimeter d = new Dosimeter();

            // Act
            int rad1 = d.QueryLatest();
            int rad2 = d.QueryLatest();

            // Assert
            Assert.IsTrue(rad1 == 45, "Dosimeter first read should be 45.");
            Assert.IsTrue(rad2 == 4, "Dosimeter second read should be 4.");
        }
    }
}
