import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";

const CardGrid = ({ projects, onSelect }) => {
  // Create a sorted copy (case-insensitive)
  const sortedProjects = [...projects].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );

  return (
    <div className="card-grid">
      <AnimatePresence mode="sync">
        {sortedProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ProjectCard project={project} onSelect={onSelect} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CardGrid;
