/**
 * A helper for working with ISO weeks, months, and dates.
 * Provides functions to get week/month/year from a date,
 * increment weeks, and get all dates of a specific week.
 */
export class DateHelper {

    /**
     * Get ISO week number, month, and year for a given date
     */
    static getDateIndex(date: Date): { year: number; month: number; week: number } {
    const tempDate = new Date(date); // clone to avoid mutation

    // ISO week starts on Monday; calculate day number (Mon=0, Sun=6)
    const dayNum = (tempDate.getDay() + 6) % 7;

    // Set tempDate to Thursday of current week (ISO 8601)
    tempDate.setDate(tempDate.getDate() - dayNum + 3);
    const firstThursday = tempDate.valueOf();

    // First Thursday of the year
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    const dayOfWeek = (yearStart.getDay() + 6) % 7;
    const firstThursdayOfYear = new Date(yearStart);
    firstThursdayOfYear.setDate(yearStart.getDate() + ((4 - dayOfWeek + 7) % 7));

    // Use Math.floor instead of Math.round to avoid fake week 53
    const weekNumber = 1 + Math.floor((firstThursday - firstThursdayOfYear.valueOf()) / 604800000);

    const year = tempDate.getFullYear();
    const month = tempDate.getMonth() + 1;

    return { year, month, week: weekNumber };
    }

    /**
     * Increment a week number by delta and return correct ISO week, month, year
     */
    static incrementWeekIndex(delta: number, weekNumber: number, yearNumber: number): { year: number; month: number; week: number } {
        // Step 1: Find the Monday of the given week
        const firstThursdayOfYear = (() => {
            const jan1 = new Date(yearNumber, 0, 1);
            const dayOfWeek = (jan1.getDay() + 6) % 7;
            const firstThursday = new Date(jan1);
            firstThursday.setDate(jan1.getDate() + ((4 - dayOfWeek + 7) % 7));
            return firstThursday;
        })();

        const weekStart = new Date(firstThursdayOfYear);
        weekStart.setDate(weekStart.getDate() - 3 + (weekNumber - 1 + delta) * 7); // Monday of target week

        // Step 2: Extract ISO week, month, year from that date
        return DateHelper.getDateIndex(weekStart);
    }

  /**
   * Get an array of Date objects representing all 7 days of a given ISO week
   */
  static getDaysOfWeek(weekNumber: number, year: number): Date[] {
    // Start with the first day of the year
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const dow = simple.getDay();
    const weekStart = new Date(simple);

    // Adjust to Monday (ISO week start)
    if (dow <= 4) {
      weekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
      weekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }

    // Generate 7 days
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }

  // DateHelper.ts
  static getWeekNumber(date: Date): number {
      const tempDate = new Date(date.getTime());
      // ISO week date helpers: set to nearest Thursday: current date + 4 - current day number
      // Make Sunday 7 instead of 0
      const dayNum = (date.getDay() + 6) % 7;
      tempDate.setDate(tempDate.getDate() - dayNum + 3);
      const firstThursday = tempDate.getTime();
      tempDate.setMonth(0, 1);
      if (tempDate.getDay() !== 4) {
          tempDate.setMonth(0, 1 + ((4 - tempDate.getDay() + 7) % 7));
      }
      return 1 + Math.ceil((firstThursday - tempDate.getTime()) / 604800000);
  }
}
