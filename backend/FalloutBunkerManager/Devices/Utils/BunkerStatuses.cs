
using System.Collections.Concurrent;

namespace FalloutBunkerManager.Devices;

public class BunkerStatuses
{
    public bool LightsOn { get; set; } = true;
    public int LightsOnThreshold { get; set; } = 50;
    public bool IsScavenging { get; set; } = false;
}
