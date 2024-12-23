
import moment from "moment";

export const getLastMonths = () => {

    const currentDate = moment();
    currentDate.date(1);

    const last6Month: string[] = [];
    const last12Month: string[] = [];

    for (let i = 0; i < 6; i++) {
        const monthDate = currentDate.clone().subtract(i, "months");
        const monthName = monthDate.format('MMMM');
        last6Month.unshift(monthName);
    }

    for (let i = 0; i < 12; i++) {
        const monthDate = currentDate.clone().subtract(i, "months");
        const monthName = monthDate.format('MMMM');
        last12Month.unshift(monthName);
    }

    return {
        last6Month,
        last12Month,
    }
}

 