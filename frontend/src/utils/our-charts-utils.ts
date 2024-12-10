import Chart, { PieAnimationOptions } from 'chart.js/auto';

export class OurChartsUtils {
    incomeData: any[] = [];
    expenseData: any[] = [];

    // определение палитры цветов
    colorPalette: string[] = ['#0D6EFD', '#FFC107', '#FD7E14', '#DC3545', '#20C997','#6610f2', '#6f42c1', '#e83e8c'];
    usedColors: string[] = []; // массив для хранения использованных цветов

    constructor(data: any) {
        data.forEach((item: any): void => {
            if (item.type === 'income') {
                this.incomeData.push(item);
            } else if (item.type === 'expense') {
                this.expenseData.push(item);
            }
        });
        this.myChart1(this.incomeData);
        this.myChart2(this.expenseData);
    }

    // пирог дохода
    myChart1(data: any): void {
        this.createChart("ourIncome", data, 'Доход', 'chartIncome');
    }

    // пирог расхода
    myChart2(data: any):void {
        this.createChart("ourExpenses", data, 'Расход', 'chartExpenses');
    }
    groupByCategory(acc: any, curr: any): any {
        const index: any = acc.findIndex((item: { category: any; }) => item.category === curr.category);

        if (index === -1) {
            acc.push({
                category: curr.category,
                amount: curr.amount
            });
            return acc;
        }

        acc[index].amount += curr.amount;

        return acc;
    }
    // общая функция для создания пирогов
    createChart(canvasId: any, data: any, label: any, noDataElementId: any): void {
        // Если на странице используется пирог, удалить его
        const chartStatus: Chart | undefined = Chart.getChart(canvasId);
        if (chartStatus !== undefined) {
            chartStatus.destroy();
        }

        const partsPie: any = [];
        const labels: any = [];
        const labelsColor: any = [];
        const ctx: any  = document.getElementById(canvasId);
        const mainPageChartNoData: HTMLElement | null = document.getElementById(noDataElementId);
        console.log(ctx,mainPageChartNoData, canvasId, noDataElementId )

// проверка на существование элемента noDataElementId
        if (!mainPageChartNoData) {
            console.error(`Элемент ${noDataElementId} не найден`);
            return;
        }

        if (!data.length) {
            mainPageChartNoData.style.display = 'flex';
            mainPageChartNoData.style.justifyContent = 'center';

        } else {
            mainPageChartNoData.style.display = 'none';

            const data1: any[] = data.reduce(this.groupByCategory, [])
            data1.forEach(item => {
                partsPie.push(item.amount);
                labels.push(item.category);
                labelsColor.push(this.getUniqueColor());
            })
            console.log(data1);

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: partsPie,
                        backgroundColor: labelsColor,
                        borderColor: 'white',
                        borderWidth: 2,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                        }
                    }
                },
            });
        }
    }

    // генерация уникального цвета
    getUniqueColor(): string | null {
        if (this.usedColors.length === this.colorPalette.length) {
            console.warn("Все цвета уже использованы");
            return this.colorPalette[0]; // возвращаем первый цвет, если все использованы
        }

        let color;
        do {
            color = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        } while (this.usedColors.includes(color));

        this.usedColors.push(color); // добавляем использованный цвет в массив
        return color;
    }
}
