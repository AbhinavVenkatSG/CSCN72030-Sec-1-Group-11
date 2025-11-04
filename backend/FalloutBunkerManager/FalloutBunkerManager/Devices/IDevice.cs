using System.Configuration.Assemblies;

interface IDevice
{
    // Parameters
    public DeviceType type { get; }

    // Methods
    public DeviceStatus QueryLatest(); // Returns latest value from device
    public void HandleCommand(DeviceCommand command);       // Each device will change this to be able to handle its commands
}