using FalloutBunkerManager.Devices;
using Microsoft.AspNetCore.Mvc;

namespace FalloutBunkerManager.Controllers;

[ApiController]
[Route("api/bunker-status")]
public class BunkerStatusController : ControllerBase
{
    private readonly BunkerStatuses bunkerStatuses;

    public BunkerStatusController(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;
    }

    [HttpPost("ration")]
    public IActionResult SetRationLevel([FromBody] RationLevelRequest request)
    {
        bunkerStatuses.RationStatus = MapRationLevel(request.Level);
        return Ok(new { bunkerStatuses.RationStatus });
    }

    [HttpPost("scrubber-threshold")]
    public IActionResult SetScrubberThreshold([FromBody] ThresholdRequest request)
    {
        bunkerStatuses.O2ScrubberPower = ClampPercent(request.Percent);
        return Ok(new { bunkerStatuses.O2ScrubberPower });
    }

    [HttpPost("light-threshold")]
    public IActionResult SetLightThreshold([FromBody] ThresholdRequest request)
    {
        bunkerStatuses.LightsOnThreshold = ClampPercent(request.Percent);
        bunkerStatuses.LightsOn = bunkerStatuses.LightsOnThreshold > 0;
        return Ok(new { bunkerStatuses.LightsOnThreshold, bunkerStatuses.LightsOn });
    }

    [HttpPost("scavenge")]
    public IActionResult SetScavenge([FromBody] ToggleRequest request)
    {
        bunkerStatuses.IsScavenging = request.Enabled;
        return Ok(new { bunkerStatuses.IsScavenging });
    }

    [HttpPost("cool-down")]
    public IActionResult SetCoolDown([FromBody] ToggleRequest request)
    {
        bunkerStatuses.CoolDownAtNight = request.Enabled;
        return Ok(new { bunkerStatuses.CoolDownAtNight });
    }

    [HttpPost("next-day")]
    public IActionResult SetNextDay([FromBody] NextDayRequest request)
    {
        ApplyNextDaySettings(request);
        // DeviceController /api/device handles running the daily cycle; this endpoint only stages the settings.
        return Ok(new
        {
            bunkerStatuses.LightsOnThreshold,
            bunkerStatuses.LightsOn,
            bunkerStatuses.RationStatus,
            bunkerStatuses.O2ScrubberPower,
            bunkerStatuses.IsScavenging,
            bunkerStatuses.CoolDownAtNight
        });
    }

    private void ApplyNextDaySettings(NextDayRequest request)
    {
        // Persist all user choices so the next device cycle uses them.
        bunkerStatuses.LightsOnThreshold = ClampPercent(request.PowerPercent);
        bunkerStatuses.LightsOn = bunkerStatuses.LightsOnThreshold > 0;
        bunkerStatuses.RationStatus = MapRationLevel(request.RationLevel);
        bunkerStatuses.O2ScrubberPower = ClampPercent(request.O2Threshold);
        bunkerStatuses.IsScavenging = request.ScavengeAtNight;
        bunkerStatuses.CoolDownAtNight = request.CoolDownAtNight;
    }

    private static int ClampPercent(int percent) => Math.Clamp(percent, 0, 100);

    private static int MapRationLevel(string? rationLevel) => rationLevel?.ToLowerInvariant() switch
    {
        "low" => 1,
        "high" => 3,
        _ => 2
    };

    public class ThresholdRequest
    {
        public int Percent { get; set; }
    }

    public class ToggleRequest
    {
        public bool Enabled { get; set; }
    }

    public class RationLevelRequest
    {
        public string? Level { get; set; }
    }

    public class NextDayRequest
    {
        public int PowerPercent { get; set; }
        public string? RationLevel { get; set; }
        public int O2Threshold { get; set; }
        public bool ScavengeAtNight { get; set; }
        public bool CoolDownAtNight { get; set; }
    }
}
