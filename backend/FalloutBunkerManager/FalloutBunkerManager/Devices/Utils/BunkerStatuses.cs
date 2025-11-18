
using System.Collections.Concurrent;

namespace FalloutBunkerManager.Devices;

public class BunkerStatuses
{
    public bool lightsOn { get; set; } = true;
    public int lightsOnThreshold { get; set; } = 50;
    public bool isScavenging { get; set; } = false;
}