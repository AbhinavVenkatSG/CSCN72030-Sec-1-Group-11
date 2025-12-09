Add MSTest structure:
using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;


namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]
    public class FoodSensorTests
    {
        private const string Folder = "SensorEmulationFiles";
        private const string FileName = "FoodLevels.dat";
        private string FilePath => Path.Combine(Folder, FileName);

        private BunkerStatuses MakeStatuses(
            int ration = 2,
            bool scavenging = false,
            float startingFood = 100f)
        {
            return new BunkerStatuses
            {
                RationStatus = ration,
                IsScavenging = scavenging,
                FoodLevel = startingFood
            };
        }

        [TestInitialize]
        public void Setup()
        {
            if (!Directory.Exists(Folder))
                Directory.CreateDirectory(Folder);

            // Ensure each test starts with a clean file
            if (File.Exists(FilePath))
                File.Delete(FilePath);
        }

        private void WriteFile(params string[] lines)
        {
            File.WriteAllLines(FilePath, lines);
        }

        
        // 1. Correct Delta + Scaling (RationStatus 2 = 1.0x)
        
        [TestMethod]
        public void QueryLatest_UsesRawDelta_WhenRationStatus2()
        {
            WriteFile("10"); // delta 10

            var statuses = MakeStatuses(ration: 2);
            var sensor = new FoodSensor(statuses);

            var result = sensor.QueryLatest();

            float expected = 100 + 10;
            Assert.AreEqual(expected, result.currentValue, 0.001f);
            Assert.AreEqual(expected, statuses.FoodLevel);
        }

    
        // 2. Ration scaling: 0.5x for RationStatus 1
        
        [TestMethod]
        public void QueryLatest_AppliesHalfScaling_WhenRation1()
        {
            WriteFile("20"); // delta 20 ? scaled to 10

            var statuses = MakeStatuses(ration: 1);
            var sensor = new FoodSensor(statuses);

            var result = sensor.QueryLatest();

            float expected = 100 + 10;
            Assert.AreEqual(expected, result.currentValue, 0.001f);
        }

        
        // 3. Ration scaling: 1.5x for RationStatus 3
       
        [TestMethod]
        public void QueryLatest_AppliesOnePointFiveScaling_WhenRation3()
        {
            WriteFile("20"); // delta 20 ? 30 after scaling

            var statuses = MakeStatuses(ration: 3);
            var sensor = new FoodSensor(statuses);

            var result = sensor.QueryLatest();

            float expected = 100 + 30;
            Assert.AreEqual(expected, result.currentValue, 0.001f);
        }

        
        // 4. Scavenging bonus 
       
        [TestMethod]
        public void QueryLatest_ScavengingAddsBonusInRange()
        {
            WriteFile("0");

            var statuses = MakeStatuses(scavenging: true);
            var sensor = new FoodSensor(statuses);

            var result = sensor.QueryLatest();

            // Bonus must be added: between 15 and 40 inclusive
            Assert.IsTrue(result.currentValue >= 115);
            Assert.IsTrue(result.currentValue <= 140);
        }

        
        // 5. Clamping to MAX=100
        
        [TestMethod]
        public void QueryLatest_ClampsAbove100()
        {
            WriteFile("50"); // 100 + 50 = 150 ? clamp to 100

            var statuses = MakeStatuses();
            var sensor = new FoodSensor(statuses);

            var result = sensor.QueryLatest();

            Assert.AreEqual(100f, result.currentValue);
            Assert.AreEqual(100f, statuses.FoodLevel);
        }

        
        // 6. Clamping to MIN=0
        
        [TestMethod]
        public void QueryLatest_ClampsBelow0()
        {
            WriteFile("-200");

            var statuses = MakeStatuses();
            var sensor = new FoodSensor(statuses);

            var result = sensor.QueryLatest();

            Assert.AreEqual(0f, result.currentValue);
            Assert.AreEqual(0f, statuses.FoodLevel);
        }

        // 7. Consecutive calls read consecutive file values
        
        [TestMethod]
        public void QueryLatest_SequentialReadsUseSequentialValues()
        {
            WriteFile("10", "5", "-3");

            var statuses = MakeStatuses();
            var sensor = new FoodSensor(statuses);

            var r1 = sensor.QueryLatest(); // 100 + 10 = 110 ? clamp to 100
            Assert.AreEqual(100f, r1.currentValue);

            var r2 = sensor.QueryLatest(); // 100 + 5 = 105 ? clamp to 100
            Assert.AreEqual(100f, r2.currentValue);

            var r3 = sensor.QueryLatest(); // 100 + (-3) = 97
            Assert.AreEqual(97f, r3.currentValue);
        }

        
        // 8. Correct DeviceType Returned
        
        [TestMethod]
        public void QueryLatest_ReturnsFoodSensorType()
        {
            WriteFile("0");

            var statuses = MakeStatuses();
            var sensor = new FoodSensor(statuses);

            var result = sensor.QueryLatest();

            Assert.AreEqual(DeviceType.FoodSensor, result.type);
        }

        
        // 9. Missing file ? should throw (FileManager throws)
        
        [TestMethod]
        [ExpectedException(typeof(FileNotFoundException))]
        public void QueryLatest_ThrowsIfMissingFile()
        {
            // Ensure file does not exist
            if (File.Exists(FilePath))
                File.Delete(FilePath);

            var statuses = MakeStatuses();
            var sensor = new FoodSensor(statuses);

            sensor.QueryLatest(); // expected exception
        }       
        
    }
}
