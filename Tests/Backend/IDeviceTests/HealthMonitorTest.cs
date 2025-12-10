using Microsoft.VisualStudio.TestTools.UnitTesting;
using FalloutBunkerManager.Devices;
using System.IO;
using System;

namespace FalloutBunkerManager.Tests.Backend.IDeviceTests
{
    [TestClass]
    public class HealthMonitorTests
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
        public void HealthMonitor_Scavenging_AppliesRadiationPenalty()
        {
            // Arrange
            File.WriteAllText(Path.Combine(TestDirectory, "HealthLevels.dat"), "0");
            
            _mockStatuses.IsScavenging = true;
            _mockStatuses.RadiationLevel = 20f; // High radiation
            _mockStatuses.HealthLevel = 100f;
            
            // Note: RationStatus defaults to 2 (Mid), which adds +10 bonus in logic
            _mockStatuses.RationStatus = 2; 

            var device = new HealthMonitor(_mockStatuses);

            // Act
            var result = device.QueryLatest();

            // Assert Calculation:
            // Base Change:   0 (File)
            // Ration Bonus: +10 (Mid Rations)
            // Scavenge Pen: -(20 * 0.5) = -10
            // Net Change:    0 + 10 - 10 = 0
            // Final Result:  100
            Assert.AreEqual(100f, result.currentValue, "Scavenge penalty (-10) should cancel out ration bonus (+10).");
        }
    }
}
