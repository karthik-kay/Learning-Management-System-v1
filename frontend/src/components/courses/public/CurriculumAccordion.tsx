"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { djangoService } from "@/services/djangoService";

export default function CurriculumAccordion({ courseId }) {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await djangoService.getCourseProgress(courseId);
      setModules(res.modules);
    }
    load();
  }, [courseId]);

  return (
    <Accordion type="multiple">
      {modules.map((module) => (
        <AccordionItem key={module.id} value={`m-${module.id}`}>
          <AccordionTrigger className="font-medium text-lg">
            {module.title}
          </AccordionTrigger>

          <AccordionContent>
            <ul className="space-y-2 mt-2 text-gray-600">
              {module.lessons.map((l) => (
                <li
                  key={l.id}
                  className="border p-2 rounded bg-gray-50 flex items-center gap-2"
                >
                  <span className="text-sm">{l.title}</span>
                  {l.is_preview && (
                    <span className="text-xs text-blue-600 border px-2 py-0.5 rounded">
                      Preview
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
