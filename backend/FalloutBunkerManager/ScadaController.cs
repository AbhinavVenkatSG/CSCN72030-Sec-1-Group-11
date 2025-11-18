using FalloutBunkerManager.Devices;

namespace FalloutBunkerManager;

class ScadaController
{
    private readonly DeviceNetwork deviceNetwork;

    // Constructor
    public ScadaController(DeviceNetwork deviceNetwork)
    {
        this.deviceNetwork = deviceNetwork;
    }

    public void MainLoop()
    {
        while (true)
        {
            // Query devices
            var statuses = QueryDevices();

            // Send statuses to front end
            // Async wait for commands
            // Dispatch commands to devices
            // If command is next day, loop
        }

    }


    /// <summary>
    /// Queries all devices and returns their statuses to the front end
    /// </summary>
    /// <returns> A list of devices statuses </returns>
    public DeviceStatus[] QueryDevices()
    {
        return deviceNetwork.QueryDevices();
    }
}
