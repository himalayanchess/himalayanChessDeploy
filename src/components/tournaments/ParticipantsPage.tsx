import React from "react";

const ParticipantsPage = () => {
  return <div>ParticipantsPage</div>;
};

export default ParticipantsPage;
// "use client";

// import { useEffect } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { v4 as uuidv4 } from "uuid";

// const initialData = {
//   participants: [
//     {
//       id: "1",
//       name: "Player A",
//       fideId: "FIDE123",
//       rating: 2500,
//       score: 2,
//     },
//     {
//       id: "2",
//       name: "Player B",
//       fideId: "FIDE124",
//       rating: 2300,
//       score: 1.5,
//     },
//     {
//       id: "3",
//       name: "Player C",
//       fideId: "FIDE125",
//       rating: 2200,
//       score: 3,
//     },
//     {
//       id: "4",
//       name: "Player D",
//       fideId: "FIDE126",
//       rating: 2100,
//       score: 2.5,
//     },
//   ],
//   rounds: [
//     {
//       roundNumber: 1,
//       tables: [
//         {
//           tableNumber: 1,
//           white: "Player A",
//           black: "Player B",
//           result: "1-0",
//         },
//         {
//           tableNumber: 2,
//           white: "Player C",
//           black: "Player D",
//           result: "0.5-0.5",
//         },
//       ],
//     },
//     {
//       roundNumber: 2,
//       tables: [
//         {
//           tableNumber: 1,
//           white: "Player B",
//           black: "Player C",
//           result: "0-1",
//         },
//         {
//           tableNumber: 2,
//           white: "Player D",
//           black: "Player A",
//           result: "0-1",
//         },
//       ],
//     },
//   ],
// };

// export default function TournamentPage() {
//   const { control, register, handleSubmit, reset, watch, setValue } = useForm({
//     defaultValues: initialData,
//   });

//   const {
//     fields: participantFields,
//     append: appendParticipant,
//     remove: removeParticipant,
//   } = useFieldArray({ control, name: "participants" });

//   const {
//     fields: roundFields,
//     append: appendRound,
//     remove: removeRound,
//   } = useFieldArray({ control, name: "rounds" });

//   const addRound = () => {
//     appendRound({
//       roundNumber: roundFields.length + 1,
//       tables: [{ tableNumber: 1, white: "", black: "", result: "" }],
//     });
//   };

//   const addTableToRound = (roundIndex) => {
//     const current = watch(`rounds.${roundIndex}.tables`);
//     const tableNumber = current.length + 1;
//     setValue(`rounds.${roundIndex}.tables`, [
//       ...current,
//       { tableNumber, white: "", black: "", result: "" },
//     ]);
//   };

//   const deleteTableFromRound = (roundIndex, tableIndex) => {
//     const current = watch(`rounds.${roundIndex}.tables`);
//     const updated = current.filter((_, i) => i !== tableIndex);
//     setValue(`rounds.${roundIndex}.tables`, updated);
//   };

//   const onKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (e.target.name === "name") {
//         const name = e.target.value;
//         const fideId = document.querySelector('[name="fideId"]').value;
//         const rating = document.querySelector('[name="rating"]').value;
//         if (name) {
//           appendParticipant({ id: uuidv4(), name, fideId, rating, score: 0 });
//           setValue("name", "");
//           setValue("fideId", "");
//           setValue("rating", "");
//           document.querySelector('[name="name"]').focus();
//         }
//       }
//     }
//   };

//   const watchAll = watch();

//   const scores = {};
//   watchAll.participants.forEach((p) => (scores[p.name] = 0));

//   watchAll.rounds.forEach((round) => {
//     round.tables.forEach(({ white, black, result }) => {
//       if (result === "1-0") scores[white] += 1;
//       else if (result === "0-1") scores[black] += 1;
//       else if (result === "0.5-0.5") {
//         scores[white] += 0.5;
//         scores[black] += 0.5;
//       }
//     });
//   });

//   const finalScores = Object.entries(scores)
//     .map(([name, score]) => ({ name, score }))
//     .sort((a, b) => b.score - a.score);

//   return (
//     <div className="p-8 max-w-5xl mx-auto space-y-10">
//       <h1 className="text-3xl font-bold text-center">🏆 Tournament Manager</h1>

//       <div className="space-y-4">
//         <h2 className="text-2xl font-semibold">Participants</h2>
//         <div className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
//           <input
//             name="name"
//             placeholder="Name"
//             className="border p-2 rounded w-full sm:w-auto"
//           />
//           <input
//             name="fideId"
//             placeholder="FIDE ID"
//             className="border p-2 rounded w-full sm:w-auto"
//           />
//           <input
//             name="rating"
//             placeholder="Rating"
//             className="border p-2 rounded w-full sm:w-auto"
//           />
//         </div>
//         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
//           {participantFields.map((p, i) => (
//             <li key={p.id} className="border p-3 rounded shadow">
//               {p.name} (ID: {p.fideId}, Rating: {p.rating})
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-semibold">Rounds</h2>
//           <button
//             onClick={addRound}
//             className="bg-green-600 text-white px-4 py-2 rounded"
//           >
//             + Add Round
//           </button>
//         </div>
//         {roundFields.map((round, i) => (
//           <div key={round.id} className="border p-4 rounded shadow space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold text-lg">
//                 Round {round.roundNumber}
//               </h3>
//               <button className="text-red-500" onClick={() => removeRound(i)}>
//                 Delete Round
//               </button>
//             </div>
//             {watch(`rounds.${i}.tables`)?.map((table, j) => (
//               <div
//                 key={table.tableNumber}
//                 className="grid grid-cols-12 items-center gap-2"
//               >
//                 <div className="col-span-1 font-medium">
//                   Table {table.tableNumber}
//                 </div>
//                 <div className="col-span-3">
//                   <label className="block text-sm">White</label>
//                   <Controller
//                     control={control}
//                     name={`rounds.${i}.tables.${j}.white`}
//                     render={({ field }) => (
//                       <select {...field} className="w-full border p-1 rounded">
//                         <option value="">Select White</option>
//                         {participantFields.map((p) => (
//                           <option key={p.id} value={p.name}>
//                             {p.name}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   />
//                 </div>
//                 <div className="col-span-3">
//                   <label className="block text-sm">Black</label>
//                   <Controller
//                     control={control}
//                     name={`rounds.${i}.tables.${j}.black`}
//                     render={({ field }) => (
//                       <select {...field} className="w-full border p-1 rounded">
//                         <option value="">Select Black</option>
//                         {participantFields.map((p) => (
//                           <option key={p.id} value={p.name}>
//                             {p.name}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   />
//                 </div>
//                 <div className="col-span-3">
//                   <label className="block text-sm">Result</label>
//                   <Controller
//                     control={control}
//                     name={`rounds.${i}.tables.${j}.result`}
//                     render={({ field }) => (
//                       <select {...field} className="w-full border p-1 rounded">
//                         <option value="1-0">1-0</option>
//                         <option value="0-1">0-1</option>
//                         <option value="0.5-0.5">0.5-0.5</option>
//                       </select>
//                     )}
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => deleteTableFromRound(i, j)}
//                   className="col-span-1 text-red-500"
//                 >
//                   Delete Table
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addTableToRound(i)}
//               className="text-blue-500"
//             >
//               + Add Table
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-4">
//         <h2 className="text-2xl font-semibold">Final Ranking</h2>
//         <table className="min-w-full border-collapse">
//           <thead>
//             <tr>
//               <th className="border p-2">Rank</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Score</th>
//             </tr>
//           </thead>
//           <tbody>
//             {finalScores.map((player, idx) => (
//               <tr key={player.name}>
//                 <td className="border p-2">{idx + 1}</td>
//                 <td className="border p-2">{player.name}</td>
//                 <td className="border p-2">{player.score}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
