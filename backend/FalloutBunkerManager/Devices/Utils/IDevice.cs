// Spencer Watkinson
// IDevice Interface, all devices implement this

namespace FalloutBunkerManager.Devices;

public interface IDevice
{
    // Parameters
    public DeviceType type { get; }
    public FileManager fileManager { get; }
    public string filePath { get; }

    // Methods
    public DeviceStatus QueryLatest(); // Returns latest value from device
}