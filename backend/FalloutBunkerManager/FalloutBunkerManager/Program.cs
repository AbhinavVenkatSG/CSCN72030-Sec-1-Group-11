using FalloutBunkerManager.Devices;

namespace FalloutBunkerManager
{
    internal class Program
    {
        static void Main(string[] args)
        {

            var bunkerStatuses = new BunkerStatuses();

            IDevice[] devices = new IDevice[]
            {
                new Thermometer(bunkerStatuses),
                new WaterSensor(bunkerStatuses),
                new FoodSensor(bunkerStatuses),
                new Generator(bunkerStatuses),
                new O2Scrubber(bunkerStatuses),
                new HealthMonitor(bunkerStatuses),
                new Dosimeter(bunkerStatuses)
            };

            var scadaController = new ScadaController(devices);

            scadaController.MainLoop();
        }
    }
}
