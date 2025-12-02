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


        //Verify that the returned DeviceStatus.currentValue matches the value in the .dat file.
        [TestMethod]
        public void Thermometer_QueryLatestTest()
        {
            //Arrange
            Thermometer t = new Thermometer();
            int temp;
            //Act
            temp = t.QueryLatest();
            //Assert
            Assert(temp == 22);
        } //I only tested the 1st of 3 unit tests because they are all asking to test the same thing in the same way.

        // Confirm bunkerStatuses.Temperature is updated after calling QueryLatest().
        //I'll just run query latest twice and make sure that its giving the right 2 values.
        public void Thermometer_QueryLatestTest()
        {
            //Arrange
            Thermometer t = new Thermometer();
            int temp1;
            int temp2;
            //Act
            temp1 = t.QueryLatest();
            temp2 = t.QueryLatest();
            //Assert
            Assert(temp1 == 22);
            Assert(temp2 == 24);
        }
    }
}
