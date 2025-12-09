Add MSTest Structure:
using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;

namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]
    public class DosimeterTests
    {        
        // 2 of the tests are already written for dosimeter in the watersensor test file.I(devki) am not moving them 


        // 1. Correct DeviceType Returned

        [TestMethod]
        public void QueryLatest_ReturnsDosimeterType()
        {
            WriteFile("0");

            var statuses = MakeStatuses();
            var sensor = new Dosimeter(statuses);

            var result = sensor.QueryLatest();

            Assert.AreEqual(DeviceType.Dosimeter, result.type);
        }

        // 2. Missing file → should throw (FileManager throws)

        [TestMethod]
        [ExpectedException(typeof(FileNotFoundException))]
        public void QueryLatest_ThrowsIfMissingFile()
        {
            // Ensure file does not exist
            if (File.Exists(FilePath))
                File.Delete(FilePath);

            var statuses = MakeStatuses();
            var sensor = new Dosimeter(statuses);

            sensor.QueryLatest(); // expected exception
        }
    }
