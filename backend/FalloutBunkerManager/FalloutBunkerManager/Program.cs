namespace FalloutBunkerManager
{
    internal class Program
    {
        static void Main(string[] args)
        {
            IDevice[] devices = new IDevice[]
            {
                new Thermometer(),
                new WaterSensor(),
                new FoodSensor(),
                new Generator(),
                new O2Scrubber(),
                new HealthMonitor(),
                new Dosimeter()
            };

            var scadaController = new ScadaController(devices);

            scadaController.MainLoop();
        }
    }
}
