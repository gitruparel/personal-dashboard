export function getDynamicGreeting(name: string): string {
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
    else if (hour >= 22 || hour < 5) timeOfDay = 'night';

    const greetings = {
        morning: [
            `Good morning, ${name}, ready to grind?`,
            `Rise and shine, ${name}! Let's get it.`,
            `Morning ${name}, time to build something great.`
        ],
        afternoon: [
            `Good afternoon, ${name}, keep the momentum going!`,
            `Halfway through the day, ${name}. Keep pushing.`,
        ],
        evening: [
            `Good evening, ${name}, still grinding?`,
            `Evening ${name}, wrapping up the day strong!`,
        ],
        night: [
            `Burning the midnight oil, ${name}?`,
            `Late night session, ${name}? Keep it up!`,
        ]
    };

    const choices = greetings[timeOfDay as keyof typeof greetings];
    return choices[Math.floor(Math.random() * choices.length)];
}
