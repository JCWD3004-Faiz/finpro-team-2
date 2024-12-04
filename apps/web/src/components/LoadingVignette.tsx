import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { ImSpinner11 } from 'react-icons/im';
import { PiSpinnerGapBold } from 'react-icons/pi';
import { MdCatchingPokemon } from 'react-icons/md';
import { TbFidgetSpinner } from 'react-icons/tb';

function LoadingVignette () {
  return (
  <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
    <CgSpinner className="animate-spin text-6xl  text-indigo-500"/>
  </div>
  );
};

export default LoadingVignette;
