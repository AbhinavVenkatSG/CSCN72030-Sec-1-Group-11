
using Microsoft.AspNetCore.Mvc;
using FalloutBunkerManager;
using FalloutBunkerManager.Devices;

namespace FalloutBunkerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeviceController : ControllerBase
    {
        // Static so devices persist across requests
        private static readonly IDevice[] devices;
        private static readonly int[] queryCounters;

        // Static constructor runs only once per app lifetime
        static DeviceController()
        {
            string sensorFolder = Path.GetFullPath(Path.Combine(
                AppDomain.CurrentDomain.BaseDirectory,
                "..", "..", "..", "..",
                "FalloutBunkerManager", "FalloutBunkerManager", "SensorEmulationFiles"
            ));

            devices = new IDevice[]
            {
                new Thermometer(sensorFolder),
                new WaterSensor(sensorFolder),
                // new FoodSensor(sensorFolder),
                new Generator(sensorFolder),
                new O2Scrubber(sensorFolder),
                new HealthMonitor(sensorFolder),
                new Dosimeter(sensorFolder)
            };

            queryCounters = new int[devices.Length];
        }

        // GET api/device
        [HttpGet]
        public ActionResult<DeviceStatus[]> GetAll()
        {
            var statuses = new DeviceStatus[devices.Length];
            Console.WriteLine($"\n==Device Update: {DateTime.Now} ==");

            for (int i = 0; i < devices.Length; i++)
            {
                statuses[i] = devices[i].QueryLatest();
                queryCounters[i]++;
                Console.WriteLine($"[{devices[i].type}] -> Current Value: {statuses[i].currentValue}");
            }

            return Ok(statuses);
        }
    }
}
