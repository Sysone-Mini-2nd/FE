export const scales = [
    { unit: "month", step: 1, format: "Y년 M" },
    { unit: "day", step: 1, format: "d일" },
];

export const columns = [
    { id: "text", header: "작업명", flexGrow: 1, align: "center"},
    { id: "start", header: "마감일", flexGrow: 1, align: "center" },
    // { id: "action", header: "", width: 50, align: "center" },
];

export const staticEditorShape = [
    {
        key: "text",
        type: "text",
        label: "작업명",
        config: {
            placeholder: "작업명을 입력하세요",
            focus: true
        }
    },
    {
        key: "details",
        type: "textarea",
        label: "상세 설명",
        config: {
            placeholder: "작업에 대한 자세한 설명을 입력하세요"
        }
    },
    { key: "type", type: "select", label: "작업 유형", options: [{ id: "task", label: "일반 작업" }] },
    { key: "start", type: "date", label: "시작일" },
    { key: "end", type: "date", label: "종료일" },
    { key: "duration", type: "counter", label: "기간 (일)" },
    // 우선순위 옵션에 '중간'을 추가합니다.
    { key: "priority", type: "select", label: "우선순위", options: [{ id: "low", label: "낮음" }, { id: "normal", label: "중간" }, { id: "high", label: "높음" }, {id: "warning", label: "긴급"}] },
    { key: "assignee", type: "select", label: "담당자", options: [] }
];

export const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
};
