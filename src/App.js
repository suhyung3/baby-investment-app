import React, { useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';

const SliderInput = ({ label, value, onChange, min, max, step, unit, hint }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-900">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 text-right text-sm font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
          min={min}
          max={max}
          step={step}
        />
        <span className="text-xs text-gray-400 w-8">{unit}</span>
      </div>
    </div>
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="w-full"
    />
    <div className="flex justify-between text-xs text-gray-400">
      <span>{min.toLocaleString()}{unit}</span>
      <span className="text-gray-500">{hint}</span>
      <span>{max.toLocaleString()}{unit}</span>
    </div>
  </div>
);

export default function BabyInvestmentCalculator() {
  const [initialGift, setInitialGift] = useState(2000);
  const [monthlyAmount, setMonthlyAmount] = useState(50);
  const [returnRate, setReturnRate] = useState(7);
  const [targetAge] = useState(20);
  const [enableSecondGift, setEnableSecondGift] = useState(false);
  const [secondGiftAge, setSecondGiftAge] = useState(10);
  const [secondGiftAmount, setSecondGiftAmount] = useState(3100);

  const calculateCompoundInterest = useMemo(() => {
    const data = [];
    const monthlyRate = returnRate / 100 / 12;
    let totalPrincipal = initialGift * 10000;
    let totalInvestment = initialGift * 10000;

    for (let year = 0; year <= targetAge; year++) {
      if (year === 0) {
        data.push({
          age: year,
          totalAsset: Math.round(totalPrincipal),
          totalInvestment: Math.round(totalInvestment),
          profit: 0,
          isGiftYear: true,
        });
      } else {
        if (enableSecondGift && year === secondGiftAge) {
          totalPrincipal += secondGiftAmount * 10000;
          totalInvestment += secondGiftAmount * 10000;
        }
        for (let month = 1; month <= 12; month++) {
          totalPrincipal = totalPrincipal * (1 + monthlyRate) + (monthlyAmount * 10000);
          totalInvestment += monthlyAmount * 10000;
        }
        data.push({
          age: year,
          totalAsset: Math.round(totalPrincipal),
          totalInvestment: Math.round(totalInvestment),
          profit: Math.round(totalPrincipal - totalInvestment),
          isGiftYear: enableSecondGift && year === secondGiftAge,
        });
      }
    }
    return data;
  }, [initialGift, monthlyAmount, returnRate, targetAge, enableSecondGift, secondGiftAge, secondGiftAmount]);

  const finalData = calculateCompoundInterest[calculateCompoundInterest.length - 1];
  const profitRate = ((finalData.profit / finalData.totalInvestment) * 100).toFixed(1);

  const donutData = [
    { name: '투자 원금', value: finalData.totalInvestment },
    { name: '복리 수익', value: finalData.profit },
  ];
  const DONUT_COLORS = ['#e8ebed', '#3182f6'];

  const formatNumber = (num) => new Intl.NumberFormat('ko-KR').format(num);

  const formatWon = (num) => {
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
    if (num >= 10000) return `${Math.round(num / 10000)}만`;
    return `${formatNumber(num)}원`;
  };

  const formatWonFull = (num) => {
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억원`;
    if (num >= 10000) return `${Math.round(num / 10000)}만원`;
    return `${formatNumber(num)}원`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-xl mx-auto">

        {/* 헤더 */}
        <div className="pt-6 pb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            👼 우리 아기 재테크 시뮬레이션
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            지금 시작하는 작은 투자가 아이의 미래를 바꿔요
          </p>
        </div>

        {/* 결과 요약 - 메인 숫자 */}
        <div className="bg-white rounded-2xl p-6 mb-3">
          <div className="text-sm text-gray-500 mb-1">만 {targetAge}세 예상 자산</div>
          <div className="text-4xl font-bold text-gray-900 tracking-tight">
            {formatWonFull(finalData.totalAsset)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-500">
              +{profitRate}%
            </span>
            <span className="text-xs text-gray-400">
              수익 {formatWonFull(finalData.profit)}
            </span>
          </div>
        </div>

        {/* 투자금 / 수익 요약 */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-2xl p-5">
            <div className="text-xs text-gray-400 mb-1">내가 넣은 돈</div>
            <div className="text-xl font-bold text-gray-900">
              {formatWonFull(finalData.totalInvestment)}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <div className="text-xs text-gray-400 mb-1">복리가 만든 수익</div>
            <div className="text-xl font-bold text-blue-500">
              {formatWonFull(finalData.profit)}
            </div>
          </div>
        </div>

        {/* 그래프 + 도넛 */}
        <div className="bg-white rounded-2xl p-6 mb-3">
          <div className="text-sm font-semibold text-gray-900 mb-5">자산 성장 추이</div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={calculateCompoundInterest}>
              <defs>
                <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3182f6" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#3182f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e8ebed" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="#e8ebed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f2f4f6" vertical={false} />
              <XAxis
                dataKey="age"
                stroke="transparent"
                interval="preserveStartEnd"
                tick={{ fontSize: 11, fill: '#b0b8c1' }}
                tickFormatter={(value) => `${value}세`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => formatWon(value)}
                stroke="transparent"
                tick={{ fontSize: 10, fill: '#b0b8c1' }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-900 rounded-xl px-4 py-3 shadow-xl">
                        <p className="text-xs text-gray-400 mb-1.5">
                          만 {label}세
                          {data.isGiftYear && <span className="ml-1 text-yellow-400">증여</span>}
                        </p>
                        <p className="text-sm font-bold text-white">{formatNumber(data.totalAsset)}원</p>
                        <p className="text-xs text-gray-400 mt-1">투자금 {formatNumber(data.totalInvestment)}원</p>
                        <p className="text-xs text-blue-400">수익 +{formatNumber(data.profit)}원</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="totalInvestment"
                stroke="#d1d6db"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorInvestment)"
                name="투자금"
              />
              <Area
                type="monotone"
                dataKey="totalAsset"
                stroke="#3182f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAsset)"
                name="총 자산"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-5 mt-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
              투자금
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              총 자산
            </div>
          </div>
        </div>

        {/* 도넛 차트 */}
        <div className="bg-white rounded-2xl p-6 mb-3">
          <div className="text-sm font-semibold text-gray-900 mb-4">투자 vs 수익</div>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={index} fill={DONUT_COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-900">+{profitRate}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                    투자 원금
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{formatWonFull(finalData.totalInvestment)}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full bg-gray-300 rounded-full" style={{ width: `${(finalData.totalInvestment / finalData.totalAsset * 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    복리 수익
                  </div>
                  <span className="text-xs font-semibold text-blue-500">{formatWonFull(finalData.profit)}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(finalData.profit / finalData.totalAsset * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 조건 설정 */}
        <div className="bg-white rounded-2xl p-6 mb-3">
          <div className="text-sm font-semibold text-gray-900 mb-4">조건 설정</div>

          {/* 프리셋 시나리오 */}
          <div className="mb-6">
            <div className="text-xs text-gray-400 mb-2">빠른 시나리오 선택</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setInitialGift(0); setMonthlyAmount(10); }}
                className={`p-3 rounded-xl text-left transition-all border ${
                  initialGift === 0 && monthlyAmount === 10
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="text-xs font-semibold text-gray-700 mb-1">차근차근</div>
                <div className="text-xs text-gray-400">증여 없이</div>
                <div className="text-xs text-gray-400">월 10만원</div>
              </button>
              <button
                onClick={() => { setInitialGift(1000); setMonthlyAmount(20); }}
                className={`p-3 rounded-xl text-left transition-all border ${
                  initialGift === 1000 && monthlyAmount === 20
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="text-xs font-semibold text-gray-700 mb-1">알뜰하게</div>
                <div className="text-xs text-gray-400">증여 1,000만원</div>
                <div className="text-xs text-gray-400">월 20만원</div>
              </button>
              <button
                onClick={() => { setInitialGift(3100); setMonthlyAmount(50); }}
                className={`p-3 rounded-xl text-left transition-all border ${
                  initialGift === 3100 && monthlyAmount === 50
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="text-xs font-semibold text-gray-700 mb-1">아낌없이</div>
                <div className="text-xs text-gray-400">증여 3,100만원</div>
                <div className="text-xs text-gray-400">월 50만원</div>
              </button>
            </div>
          </div>

          <div className="space-y-7">
            <SliderInput
              label="초기 증여금"
              value={initialGift}
              onChange={setInitialGift}
              min={0}
              max={5000}
              step={100}
              unit="만원"
              hint="비과세 한도 2,000만원"
            />
            <SliderInput
              label="월 적립금"
              value={monthlyAmount}
              onChange={setMonthlyAmount}
              min={0}
              max={200}
              step={10}
              unit="만원"
              hint="아동수당 및 부모급여 활용"
            />
            <SliderInput
              label="연 기대 수익률"
              value={returnRate}
              onChange={setReturnRate}
              min={0}
              max={15}
              step={0.1}
              unit="%"
              hint="S&P500 평균 7~10%"
            />
          </div>

          {/* 2차 증여 */}
          <div className="mt-7 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="secondGift"
                checked={enableSecondGift}
                onChange={(e) => setEnableSecondGift(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded"
              />
              <div className="flex-1">
                <label htmlFor="secondGift" className="text-sm font-medium text-gray-900 cursor-pointer">
                  2차 증여 전략
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  10년마다 비과세 증여 한도 갱신
                </p>

                {enableSecondGift && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">증여 시점</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={secondGiftAge}
                          onChange={(e) => setSecondGiftAge(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none transition-all"
                          min="1"
                          max={targetAge}
                        />
                        <span className="text-xs text-gray-400 shrink-0">세</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">증여 금액</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={secondGiftAmount}
                          onChange={(e) => setSecondGiftAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none transition-all"
                          min="0"
                          step="100"
                        />
                        <span className="text-xs text-gray-400 shrink-0">만원</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 연도별 테이블 */}
        <div className="bg-white rounded-2xl p-6 mb-3">
          <div className="text-sm font-semibold text-gray-900 mb-4">연도별 변화</div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left text-xs font-medium text-gray-400">나이</th>
                  <th className="pb-3 text-right text-xs font-medium text-gray-400">투자금</th>
                  <th className="pb-3 text-right text-xs font-medium text-gray-400">총 자산</th>
                  <th className="pb-3 text-right text-xs font-medium text-gray-400">수익</th>
                </tr>
              </thead>
              <tbody>
                {calculateCompoundInterest
                  .filter((_, idx) => idx % 2 === 0 || idx === calculateCompoundInterest.length - 1)
                  .map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-gray-50 ${item.isGiftYear ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="py-3 text-sm text-gray-600">
                      {item.age}세
                      {item.isGiftYear && <span className="ml-1 text-blue-500 text-xs font-medium">증여</span>}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-400">
                      {formatWonFull(item.totalInvestment)}
                    </td>
                    <td className="py-3 text-right text-sm font-semibold text-gray-900">
                      {formatWonFull(item.totalAsset)}
                    </td>
                    <td className="py-3 text-right text-sm text-blue-500">
                      +{formatWonFull(item.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center py-8 text-xs text-gray-400 space-y-0.5">
          <p>세금, 수수료를 고려하지 않은 단순 시뮬레이션이에요</p>
          <p>실제 투자 결과는 시장 상황에 따라 달라질 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}
