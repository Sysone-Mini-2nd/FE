import { Gantt, Willow, Toolbar } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import { useRef} from "react";
import { tasks, links, scales, columns, editorShape } from "../../data/ganttData";

function GanttChart() {
  const apiRef = useRef();

  return (
    <div className="py-2 min-h-full">
      <div className="border border-gray-200 rounded-lg overflow-auto h-full">
        <Willow>
          <Gantt 
            ref={apiRef}
            tasks={tasks} 
            links={links} 
            scales={scales}
            columns={columns}
            editorShape={editorShape}
          />
        </Willow>
      </div>
    </div>
  );
};

export default GanttChart;
