export function getFinalLitchesWinners(dbWinners: any[], newWinners: any[]) {
  let updatedWinners = JSON.parse(JSON.stringify(dbWinners || []));

  newWinners.forEach((newWinner) => {
    const index = updatedWinners.findIndex(
      (w: any) => w.studentId?.toString() === newWinner.studentId?.toString()
    );

    if (index !== -1) {
      updatedWinners[index] = { ...newWinner, activeStatus: true };
    } else {
      updatedWinners.push({ ...newWinner, activeStatus: true });
    }
  });

  updatedWinners = updatedWinners.map((winner: any) => {
    const stillPresent = newWinners.some(
      (newW) => newW.studentId?.toString() === winner.studentId?.toString()
    );
    return stillPresent ? winner : { ...winner, activeStatus: false };
  });

  return updatedWinners;
}
