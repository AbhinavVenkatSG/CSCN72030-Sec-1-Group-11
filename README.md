# Welcome Fallout Bunker Manager

Created by:
Abhinav, Devki, Rami, Ricardo, Spencer

# Get started

1. Install dependencies

   ```bash
   npm install
   ```

FROM REPO ROOT:

2. Start the api (Terminal 1)

   ```bash
   dotnet run --project .\backend\FalloutBunkerManager\
   ```

3. Start the ui (Terminal 2)

   ```bash
   npm start
   ```

# AI Usage

GenAI was used to:

- Create most of the FileManager class (Simple file reader)
- Create the values put into the SensorEmulationFiles/ .dat files
- All of the CSS Styling
- Assisted some react component creation at first (health bar, thermometer)
- Typing autocomplete

# User Stories

This bunker manager must fulfill the following user stories:  

### Epic 1: Reading the devices

- As bunker manager, I want to view the live readings of the exterior thermostat, so that I can make decisions based on the current outside temperature.
- As bunker manager, I want to view the live readings of the exterior dosimeter, so that I can make decisions based on the current outside radiation levels.
- As bunker manager, I want to view the live readings of the food level sensor, so that I can make decisions based on how much food we have left in the bunker.
- As bunker manager, I want to view the live readings of the water level sensor, so that I can make decisions based on how much drinking water we have left in the bunker.
- As bunker manager, I want to view the live data from the generator, so that I can make decisions based on how much gasoline is left in the generator.
- As bunker manager, I want to view the live data from the oxygen scrubber, so that I can make decisions based on the current oxygen level in the bunker.
- As bunker manager, I want to view the live data from the health monitor, so that I can make decisions based on the well-being of the bunker occupant(s).

### Epic 2: Controlling the devices

- As a bunker manager, I want to be able to control the ration levels of the bunker, so that I can vary the speed at which we use our bunker food supply each cycle, trading off well-being in the process.
- As a bunker manager, I want to be able to control level of generator to set up a load shedding threshold that turns off our lights at a certain gasoline level, so that I can vary the speed at which use our bunker uses gasoline per cycle, trading off well-being in the process.
- As a bunker manager, I want to be able to control how hard the O2 scrubber is running, so that I can vary the speed the oxygen scrubber uses up gasoline, trading off the oxygen levels in the process.
- As a bunker manager, I want to choose to spend water to cool the bunker if the temperature is too high, to not endure heat damage and lose bunker well-being.
- As a bunker manager, I want to be able to send out a search party to scavenge for supplies, so that I can increase the level of water, food, and gasoline we have in the bunker, trading off well-being in the process.

# Device logic

Note: Dosimeter/Thermometer daily values are positive, all other daily values are **negative delta** values which change the current level

## Dosimeter (Radiation Level)

Per day:

- Dosimeter reads daily value from RadiationLevels.dat
- Updates BunkerStatuses w/ radiation level

## Thermometer (Temperature)

Per day:

- Thermometer reads daily value from Temperature.dat
- Updates BunkerStatuses w/ temperature level

## Food Sensor (Food Level)

Per day:

- Food Sensor reads daily delta value from FoodLevels.dat
- Depending on ration level in BunkerStatuses, the daily value will be modified
(ie. 1/Low - daily usage is 0.5x, 2/Mid - Daily usage isn't changed, 3/High - Daily usage is 1.5x)
- Depending on IsScavenging in BunkerStatuses, the daily value is increased by a random amount(15-40).
- Changes current level by daily value
- Clamp current level between 0-100
- Updates BunkerStatuses w/ current food level

## Water Sensor (Water Level)

Per day:

- Water Sensor reads daily delta value from WaterLevels.dat
- Depending on IsScavenging in BunkerStatuses, the daily value is increased by a random amount (15-40).
- Depending on CoolDownAtNight in BunkerStatuses, the daily value will decrease by 15
- Changes current level by daily value
- Clamp current level between 0-100
- Updates BunkerStatuses w/ current water level

## Generator (Gas Level)

Per day:

- Generator reads daily delta value from GasolineLevels.dat
- Depending on O2ScrubberPower in BunkerStatuses, daily value is decreased (62% o2power = 0.62x daily use)
- If current gas level is less than LightsOnThreshold in BunkerStatuses, less daily gas will be used (0.5x)
- Depending on IsScavenging in BunkerStatuses, the daily value is increased by a random amount (15-40).
- Changes current level by daily value
- Clamp current level between 0-100
- Updates BunkerStatuses w/ current gas level
- Updates BunkerStatuses with current LightsOn status, depending on CurGasLevel > LightsOnThreshold

## O2 Scrubber (O2 Level)

Per day:

- O2 scrubber reads daily delta value from OxygenLevels.dat
- If GasolineLevel = 0, skip next line:
- Depending on O2ScrubberPower in BunkerStatuses, daily value is increased (62% o2power = daily use + 25 * 0.62)
- Changes current level by daily value
- Clamp current level between 0-100
- Updates BunkerStatuses w/ current oxygen level

## Health Monitor (Wellbeing)

Per day:

- Health Monitor reads daily value from HealthLevels.dat
- If Scavenge in BunkerStatuses is true, decrease daily value by (DV - RadiationLevel * 0.5)
- If Temperature > 35 and CoolDownAtNight is false in BunkerStatuses, daily value -20. If CoolDown = true, do nothing
- If OxygenLevel = 0, DV - 10
- If WaterLevel = 0, DV - 5
- If FoodLevel = 0, DV - 5, and skip next line:
- Depending on RationLevel in BunkerStatuses, daily value gets increase by (Low +5, Mid +10, High +15)
- Depending on LightsOn in BunkerStatuses, daily value doubles if lights are off
- Changes current level by daily value
- Clamp current level between 0-100
- Updates BunkerStatuses w/ current level

### The devices should update in this order, each cycle

1. Health Monitor
2. Food Sensor
3. Water Sensor
4. o2 Scrubber
5. Generator
6. Thermometer
7. Dosimeter
