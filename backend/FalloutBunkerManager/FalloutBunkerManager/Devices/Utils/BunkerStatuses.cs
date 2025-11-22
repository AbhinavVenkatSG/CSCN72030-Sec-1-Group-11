
using System.Collections.Concurrent;

namespace FalloutBunkerManager.Devices;

public class BunkerStatuses
{
    public bool lightsOn { get; set; } = true;
    public int lightsOnThreshold { get; set; } = 50;
    public bool isScavenging { get; set; } = false;
    public int rationStatus { get; set; } = 2;      // value are low = 1, medium = 2, high = 3
    public int O2ScrubberPower { get; set; } = 0;

    public int raditaionLevel { get; set; } = 0; // keep the range 0-10, if the radiation is under 2 the health won't affect,
                                                 // if between 2-6 health goes down 20%
                                                 // if above 6 health goes down 50%
}