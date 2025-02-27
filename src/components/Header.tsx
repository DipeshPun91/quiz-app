import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="container mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Image src="/images/logo.svg" alt="QuizApp" width={40} height={40} />
          <span className="ml-2 bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text text-2xl font-bold">
            Quiz
          </span>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Get Started
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
