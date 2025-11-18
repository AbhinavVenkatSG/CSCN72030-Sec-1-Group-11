using Microsoft.AspNetCore.Mvc;
using FalloutBunkerManager.Devices;

namespace FalloutBunkerManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeviceController : ControllerBase
    {
        private readonly DeviceNetwork deviceNetwork;

        public DeviceController(DeviceNetwork deviceNetwork)
        {
            this.deviceNetwork = deviceNetwork;
        }

        // GET api/device
        [HttpGet]
        public ActionResult<DeviceStatus[]> GetAll()
        {
            var statuses = deviceNetwork.QueryDevices();
            Console.WriteLine($"\n==Device Update: {DateTime.Now} ==");

            var devices = deviceNetwork.Devices;

            for (int i = 0; i < statuses.Length; i++)
            {
                Console.WriteLine($"[{devices[i].type}] -> Current Value: {statuses[i].currentValue}");
            }

            return Ok(statuses);
        }
    }
}
