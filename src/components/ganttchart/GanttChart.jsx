import { Gantt, Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useRef, useMemo, useCallback } from "react";
import { useProjectIssues, useCreateIssue, useUpdateIssue, useDeleteIssue } from "../../hooks/useIssueQueries";
import { scales, columns, staticEditorShape, calculateDuration } from "./ganttChart.config";
import { debounce } from 'lodash';
/** 작성자: 김대호, 백승준 */
function GanttChart({ projectId }) {
    const apiRef = useRef(null);
    const isDragUpdateRef = useRef(false);
    const dragTimeoutRef = useRef(null);

    const { data: issues, isLoading, isError, error } = useProjectIssues(projectId, {});
    const createIssueMutation = useCreateIssue();
    const updateIssueMutation = useUpdateIssue();
    const deleteIssueMutation = useDeleteIssue();

    const debouncedPatchUpdate = useMemo(() =>
        debounce((id) => {
            const task = apiRef.current?.getTask(id);
            if (!task || !task.start || !task.end) {
                console.error("PATCH 요청에 필요한 날짜 정보가 누락되었습니다.", { id, task });
                return;
            }
            const startDate = new Date(task.start);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(task.end);
            endDate.setHours(23, 59, 59, 999);
            const patchData = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            updateIssueMutation.mutate({ projectId, issueId: id, issueData: patchData, isPatch: true });
        }, 500),
        [projectId, updateIssueMutation]
    );

    const handleDragUpdate = useCallback((ganttEvent) => {
        if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
        isDragUpdateRef.current = true;
        if (ganttEvent && ganttEvent.id) {
            debouncedPatchUpdate(ganttEvent.id);
        }
        dragTimeoutRef.current = setTimeout(() => { isDragUpdateRef.current = false; }, 600);
    }, [debouncedPatchUpdate]);

    const handleEditorUpdate = useCallback((ganttEvent) => {
        if (isDragUpdateRef.current) return;

        const id = ganttEvent.id;
        const task = ganttEvent.task;
        if (!id || !task) return;

        const originalIssue = issues.find(issue => issue.id === id);
        if (!originalIssue) {
            console.error(`원본 이슈(ID: ${id})를 찾을 수 없어 업데이트를 진행할 수 없습니다.`);
            return;
        }

        const startDate = new Date(task.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(task.end);
        endDate.setHours(23, 59, 59, 999);

        const issueData = {
            status: originalIssue.status,
            projectId: projectId,
            title: task.text,
            desc: task.details,
            priority: task.priority.toUpperCase(),
            memberId: task.assignee === 'unassigned' ? null : parseInt(task.assignee, 10),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };
        updateIssueMutation.mutate({ projectId, issueId: id, issueData });
    }, [issues, projectId, updateIssueMutation]);

    const debouncedEditorUpdate = useMemo(() => debounce(handleEditorUpdate, 500), [handleEditorUpdate]);

    const handleTaskDelete = useCallback((ganttEvent) => {
        const id = ganttEvent.id;
        if (id) {
            deleteIssueMutation.mutate({ projectId, issueId: id });
        }
    }, [projectId, deleteIssueMutation]);

    const handleAddTask = useCallback(() => {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(23, 59, 59, 999);

        const newIssueData = {
            title: "새로운 이슈",
            desc: "",
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            priority: "NORMAL",
            status: "TODO",
        };

        createIssueMutation.mutate({
            projectId,
            issueData: newIssueData,
        });

        return false;
    }, [projectId, createIssueMutation]);

    const handleGanttInit = useCallback((gantt) => {
        gantt.on("move-task", handleDragUpdate);
        gantt.on("drag-task", handleDragUpdate);
        gantt.on("update-task", debouncedEditorUpdate);
        gantt.on("delete-task", handleTaskDelete);
        gantt.on("add-task", handleAddTask);
        apiRef.current = gantt;

        return () => {
            debouncedEditorUpdate.cancel();
            debouncedPatchUpdate.cancel();
            if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
        };
    }, [handleDragUpdate, debouncedEditorUpdate, debouncedPatchUpdate, handleTaskDelete, handleAddTask]);

    const dynamicEditorShape = useMemo(() => {
        if (!issues) return staticEditorShape;
        const memberMap = new Map();
        issues.forEach(issue => {
            if (issue.memberId && issue.memberName && !memberMap.has(issue.memberId)) {
                memberMap.set(issue.memberId, issue.memberName);
            }
        });
        const dynamicAssigneeOptions = Array.from(memberMap, ([id, name]) => ({ id: id.toString(), label: name }));
        dynamicAssigneeOptions.unshift({ id: 'unassigned', label: '미지정' });
        return staticEditorShape.map(editor => {
            if (editor.key === 'assignee') {
                return { ...editor, options: dynamicAssigneeOptions };
            }
            return editor;
        });
    }, [issues]);

    const ganttTasks = useMemo(() => {
        if (!issues) return [];
        return issues.map(issue => ({
            id: issue.id,
            text: issue.title,
            details: issue.desc,
            start: new Date(issue.startDate),
            end: new Date(issue.endDate),
            duration: calculateDuration(issue.startDate, issue.endDate),
            progress: issue.status === 'DONE' ? 100 : 0,
            type: "task",
            priority: issue.priority.toLowerCase(),
            assignee: issue.memberId ? issue.memberId.toString() : 'unassigned',
        }));
    }, [issues]);

    if (isLoading || !issues) {
        return <div>Gantt Chart 데이터를 불러오는 중입니다...</div>;
    }

    if (isError) {
        console.error('❌ Gantt Chart - Query Error:', error);
        return <div>데이터를 불러오는 중 에러가 발생했습니다.</div>;
    }

    return (
        <div className="py-2 min-h-full">
            <div className="border border-gray-200 rounded-lg overflow-auto h-full">
                <Willow>
                    <Gantt
                        init={handleGanttInit}
                        tasks={ganttTasks}
                        scales={scales}
                        columns={columns}
                        editorShape={dynamicEditorShape}
                    />
                </Willow>
            </div>
        </div>
    );
};

export default GanttChart;
