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


        //Verify that the Thermometer is reading the right values from the right file
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
        }

        //Confirm bunkerStatuses.Temperature is updated after calling QueryLatest().
        //I'll just run query latest twice and make sure that its giving the right 2 values.
        public void Thermometer_UpdateTest()
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


        //Verify that the Dosimeter is reading the right values from the right file
        [TestMethod]
        public void Dosimeter_QueryLatestTest()
        {
            //Arrange
            Dosimeter d = new Dosimeter();
            int rad;
            //Act
            rad = d.QueryLatest();
            //Assert
            Assert(rad == 45);
        } 

        //Verify that the Dosimeter is updating properly after every day and reading the right line of the file
        public void Dosimeter_QueryLatestTest()
        {
            //Arrange
            Dosimeter d = new Dosimeter();
            int rad1;
            int rad2;
            //Act
            rad1 = t.QueryLatest();
            rad2 = t.QueryLatest();
            //Assert
            Assert(rad1 == 45);
            Assert(rad2 == 4);
        }
    }
}
