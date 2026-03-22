export function getDynamicGreeting(name: string, streak: number, progress: number, targetSize: number): string {
    const hour = new Date().getHours();
    const displayName = name.split(' ')[0];
    
    // Categorize by time and state
    const isLateNight = hour >= 22 || hour < 4;
    const isMorning = hour >= 4 && hour < 11;
    const isMidDay = hour >= 11 && hour < 17;
    const isEvening = hour >= 17 && hour < 22;

    const progressPercent = Math.round((progress / (targetSize || 150)) * 100);

    const categories = {
        lateNight: [
            `Still up, ${displayName}? The grind is silent.`,
            `Zero noise, ${displayName}. Just the code.`,
            `Midnight logic hits different, doesn't it?`,
            `Sleep is for the weak. Or the organized.`,
            `3 AM. Genius or desperation?`
        ],
        morning: [
            `Early start. Smart move, ${displayName}.`,
            `The compiler is awake. Are you?`,
            `Fresh state. Let's make it count.`,
            `Morning, ${displayName}. Solve some problems.`,
            `Standard morning routine: Coffee. Code. Repeat.`
        ],
        standard: [
            `Keep it moving, ${displayName}.`,
            `Nonchalant execution. That's the vibe.`,
            `What's the plan today, ${displayName}?`,
            `Momentum is everything. Don't lose it.`,
            `Consistency isn't a choice, it's a system.`
        ],
        streakHigh: [
            `${streak} days. Consistent. I respect it.`,
            `The streak is ${streak}. Keep the chain heavy.`,
            `${streak} days deep. Don't let it end today.`,
            `Momentum looks good on you, ${displayName}.`
        ],
        progressHigh: [
            `${progressPercent}% done. Almost respectable.`,
            `Nearly there. Keep your head down.`,
            `The target is close. Finish it.`
        ]
    };

    let choices = categories.standard;

    // Hierarchy of choice
    if (progressPercent >= 80) choices = [...choices, ...categories.progressHigh];
    if (streak >= 5) choices = [...choices, ...categories.streakHigh];
    if (isLateNight) choices = categories.lateNight;
    else if (isMorning) choices = categories.morning;

    // Pick a random line from the selected pool
    return choices[Math.floor(Math.random() * choices.length)];
}
