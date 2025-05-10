export function getFinalParticipants(
  dbParticipants: any[],
  newParticipants: any[]
) {
  let updatedParticipants = JSON.parse(JSON.stringify(dbParticipants || []));

  newParticipants.forEach((newParticipant) => {
    const index = updatedParticipants.findIndex(
      (p: any) =>
        p.studentId?.toString() === newParticipant.studentId?.toString()
    );

    if (index !== -1) {
      updatedParticipants[index] = { ...newParticipant, activeStatus: true };
    } else {
      updatedParticipants.push({ ...newParticipant, activeStatus: true });
    }
  });

  updatedParticipants = updatedParticipants.map((participant: any) => {
    const stillPresent = newParticipants.some(
      (newP) => newP.studentId?.toString() === participant.studentId?.toString()
    );
    return stillPresent ? participant : { ...participant, activeStatus: false };
  });

  return updatedParticipants;
}
