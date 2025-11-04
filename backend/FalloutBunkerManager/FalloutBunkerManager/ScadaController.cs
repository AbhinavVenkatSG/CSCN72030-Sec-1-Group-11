class ScadaController
{
    private IDevice[] deviceList;

    // Constructor
    public ScadaController(IDevice[] devices)
    {
        deviceList = devices;
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
        var deviceStatuses = new DeviceStatus[deviceList.Length];

        for (int i = 0; i < deviceList.Length; i++)
        {
            DeviceStatus status = deviceList[i].QueryLatest();
            deviceStatuses[i] = status;
        }

        return deviceStatuses;
    }
}