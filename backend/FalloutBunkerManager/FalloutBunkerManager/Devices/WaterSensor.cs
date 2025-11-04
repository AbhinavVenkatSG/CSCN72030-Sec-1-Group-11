class WaterSensor : IDevice
{
    public DeviceType type { get { return DeviceType.WaterSensor; } }

    public DeviceStatus QueryLatest()
    {
        throw new NotImplementedException();
        // Read from file
        // Do device specific math, if required
        // return new DeviceStatus
        // { 
        //     type = DeviceType.WaterSensor,
        //     currentValue = 0 // Replace with actual processed value
        // };
    }

    public void HandleCommand(DeviceCommand command)
    {
        throw new NotImplementedException();
        // Im not sure yet, sprint 2 issue :P
    }
}