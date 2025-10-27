import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard"; // or whatever your card component is

const CardGrid = ({ projects, onSelect }) => {
  return (
    <div className="card-grid">
      <AnimatePresence mode="sync">
        {projects.map((project) => (
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
