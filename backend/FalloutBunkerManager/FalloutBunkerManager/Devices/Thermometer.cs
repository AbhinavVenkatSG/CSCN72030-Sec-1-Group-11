class Thermometer : IDevice
{
    public DeviceType type { get { return DeviceType.Thermometer; } }

    public DeviceStatus QueryLatest()
    {
        // Read from file
        // Do device specific math, if required

        return new DeviceStatus
        { 
            type = DeviceType.Thermometer,
            currentValue = 0 // Replace with actual processed value
        };
    }

    public void HandleCommand(DeviceCommand command)
    {
        throw new NotImplementedException();
        // Im not sure yet, sprint 2 issue :P
    }
}