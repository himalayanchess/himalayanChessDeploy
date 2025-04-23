import React from "react";

const AddTournament = () => {
  return <div>AddTournament</div>;
};

export default AddTournament;

// "use client";
// import { useState } from "react";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Chip,
//   IconButton,
//   Box,
//   FormHelperText,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";

// export default function AddTournament() {
//   const [open, setOpen] = useState(false);
//   const [seriesDialogOpen, setSeriesDialogOpen] = useState(false);
//   const [tournaments, setTournaments] = useState([]);
//   const [series, setSeries] = useState([]);

//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//     setValue,
//     getValues,
//   } = useForm({
//     defaultValues: {
//       name: "",
//       organizedBy: { type: "HCA", organizerName: "" },
//       series: { isPartOfSeries: false, seriesId: "", seriesName: "" },
//       dates: { start: null, end: null },
//       venue: { name: "", address: "", googleMapsLink: "" },
//       ratingInfo: {
//         isRated: false,
//         fideEventCode: "",
//         fideUrl: "",
//         chessResultsUrl: "",
//       },
//       arbiters: [],
//       contact: { person: "", role: "", emails: [""], phones: [""] },
//       media: { photosDriveLink: "", selectedPhotosDriveLink: "" },
//     },
//   });

//   const {
//     fields: arbiterFields,
//     append: appendArbiter,
//     remove: removeArbiter,
//   } = useFieldArray({
//     control,
//     name: "arbiters",
//   });

//   const {
//     fields: emailFields,
//     append: appendEmail,
//     remove: removeEmail,
//   } = useFieldArray({
//     control,
//     name: "contact.emails",
//   });

//   const {
//     fields: phoneFields,
//     append: appendPhone,
//     remove: removePhone,
//   } = useFieldArray({
//     control,
//     name: "contact.phones",
//   });

//   const organizedByType = watch("organizedBy.type");
//   const isPartOfSeries = watch("series.isPartOfSeries");
//   const isRated = watch("ratingInfo.isRated");

//   const onSubmit = (data) => {
//     // Generate HCA event code based on type
//     const hcaEventCode = {
//       HCA: "001",
//       Affiliated: "002",
//       External: "003",
//       StudentInitiated: "004",
//     }[data.organizedBy.type];

//     const tournamentData = {
//       ...data,
//       hcaEventCode,
//       createdAt: new Date().toISOString(),
//     };

//     console.log("Submitting:", tournamentData);
//     // Here you would typically make an API call to save the tournament
//     setTournaments([...tournaments, tournamentData]);
//     reset();
//     setOpen(false);
//   };

//   const handleAddSeries = () => {
//     const seriesName = getValues("series.seriesName");
//     if (seriesName) {
//       const newSeries = {
//         id: `series-${series.length + 1}`,
//         name: seriesName,
//       };
//       setSeries([...series, newSeries]);
//       setValue("series.seriesId", newSeries.id);
//       setSeriesDialogOpen(false);
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Tournament Management
//         </Typography>

//         <Button
//           variant="contained"
//           onClick={() => setOpen(true)}
//           sx={{ mb: 3 }}
//         >
//           Create New Tournament
//         </Button>

//         {/* Tournament List Table */}
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Type</TableCell>
//                 <TableCell>Dates</TableCell>
//                 <TableCell>Venue</TableCell>
//                 <TableCell>Rated</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tournaments.map((tournament, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{tournament.name}</TableCell>
//                   <TableCell>
//                     <Chip label={tournament.organizedBy.type} />
//                   </TableCell>
//                   <TableCell>
//                     {new Date(tournament.dates.start).toLocaleDateString()} -{" "}
//                     {new Date(tournament.dates.end).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>{tournament.venue.name}</TableCell>
//                   <TableCell>
//                     {tournament.ratingInfo.isRated ? "Yes" : "No"}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Create Tournament Dialog */}
//         <Dialog
//           open={open}
//           onClose={() => setOpen(false)}
//           maxWidth="md"
//           fullWidth
//         >
//           <DialogTitle>Create New Tournament</DialogTitle>
//           <DialogContent>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <Grid container spacing={3} sx={{ mt: 1 }}>
//                 {/* Basic Information */}
//                 <Grid item xs={12}>
//                   <Controller
//                     name="name"
//                     control={control}
//                     rules={{ required: "Tournament name is required" }}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Tournament Name"
//                         fullWidth
//                         error={!!errors.name}
//                         helperText={errors.name?.message}
//                       />
//                     )}
//                   />
//                 </Grid>

//                 {/* Organized By */}
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="organizedBy.type"
//                     control={control}
//                     render={({ field }) => (
//                       <FormControl fullWidth>
//                         <InputLabel>Organized By</InputLabel>
//                         <Select {...field} label="Organized By">
//                           <MenuItem value="HCA">
//                             HCA (HCA_Event_Code: 001)
//                           </MenuItem>
//                           <MenuItem value="Affiliated">
//                             Affiliated to HCA (HCA_Event_Code: 002)
//                           </MenuItem>
//                           <MenuItem value="External">
//                             Not Related to Academy (HCA_Event_Code: 003)
//                           </MenuItem>
//                           <MenuItem value="StudentInitiated">
//                             Student Initiative (HCA_Event_Code: 004)
//                           </MenuItem>
//                         </Select>
//                       </FormControl>
//                     )}
//                   />
//                 </Grid>

//                 {["Affiliated", "External"].includes(organizedByType) && (
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="organizedBy.organizerName"
//                       control={control}
//                       rules={{ required: "Organizer name is required" }}
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           label="Organizer Name"
//                           fullWidth
//                           error={!!errors.organizedBy?.organizerName}
//                           helperText={
//                             errors.organizedBy?.organizerName?.message
//                           }
//                         />
//                       )}
//                     />
//                   </Grid>
//                 )}

//                 {/* Series Information */}
//                 <Grid item xs={12}>
//                   <Controller
//                     name="series.isPartOfSeries"
//                     control={control}
//                     render={({ field }) => (
//                       <FormControlLabel
//                         control={<Checkbox {...field} checked={field.value} />}
//                         label="Is part of a tournament series?"
//                       />
//                     )}
//                   />
//                 </Grid>

//                 {isPartOfSeries && (
//                   <>
//                     <Grid item xs={12} md={6}>
//                       <Controller
//                         name="series.seriesId"
//                         control={control}
//                         rules={{ required: "Please select a series" }}
//                         render={({ field }) => (
//                           <FormControl
//                             fullWidth
//                             error={!!errors.series?.seriesId}
//                           >
//                             <InputLabel>Select Series</InputLabel>
//                             <Select
//                               {...field}
//                               label="Select Series"
//                               onChange={(e) => {
//                                 field.onChange(e);
//                                 const selectedSeries = series.find(
//                                   (s) => s.id === e.target.value
//                                 );
//                                 if (selectedSeries) {
//                                   setValue(
//                                     "series.seriesName",
//                                     selectedSeries.name
//                                   );
//                                 }
//                               }}
//                             >
//                               {series.map((s) => (
//                                 <MenuItem key={s.id} value={s.id}>
//                                   {s.name}
//                                 </MenuItem>
//                               ))}
//                               <MenuItem
//                                 onClick={() => setSeriesDialogOpen(true)}
//                               >
//                                 <Box display="flex" alignItems="center">
//                                   <AddIcon fontSize="small" sx={{ mr: 1 }} />
//                                   Create New Series
//                                 </Box>
//                               </MenuItem>
//                             </Select>
//                             {errors.series?.seriesId && (
//                               <FormHelperText>
//                                 {errors.series.seriesId.message}
//                               </FormHelperText>
//                             )}
//                           </FormControl>
//                         )}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <Controller
//                         name="series.seriesName"
//                         control={control}
//                         rules={{ required: "Series name is required" }}
//                         render={({ field }) => (
//                           <TextField
//                             {...field}
//                             label="Series Name"
//                             fullWidth
//                             error={!!errors.series?.seriesName}
//                             helperText={errors.series?.seriesName?.message}
//                           />
//                         )}
//                       />
//                     </Grid>
//                   </>
//                 )}

//                 {/* Dates */}
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="dates.start"
//                     control={control}
//                     rules={{ required: "Start date is required" }}
//                     render={({ field }) => (
//                       <DatePicker
//                         {...field}
//                         label="Start Date"
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             fullWidth
//                             error={!!errors.dates?.start}
//                             helperText={errors.dates?.start?.message}
//                           />
//                         )}
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="dates.end"
//                     control={control}
//                     rules={{
//                       required: "End date is required",
//                       validate: (value) => {
//                         const startDate = getValues("dates.start");
//                         if (startDate && value < startDate) {
//                           return "End date must be after start date";
//                         }
//                         return true;
//                       },
//                     }}
//                     render={({ field }) => (
//                       <DatePicker
//                         {...field}
//                         label="End Date"
//                         minDate={getValues("dates.start")}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             fullWidth
//                             error={!!errors.dates?.end}
//                             helperText={errors.dates?.end?.message}
//                           />
//                         )}
//                       />
//                     )}
//                   />
//                 </Grid>

//                 {/* Venue */}
//                 <Grid item xs={12}>
//                   <Typography variant="h6" gutterBottom>
//                     Venue Information
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="venue.name"
//                     control={control}
//                     rules={{ required: "Venue name is required" }}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Venue Name"
//                         fullWidth
//                         error={!!errors.venue?.name}
//                         helperText={errors.venue?.name?.message}
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="venue.address"
//                     control={control}
//                     rules={{ required: "Address is required" }}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Address"
//                         fullWidth
//                         error={!!errors.venue?.address}
//                         helperText={errors.venue?.address?.message}
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Controller
//                     name="venue.googleMapsLink"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Google Maps Link"
//                         fullWidth
//                       />
//                     )}
//                   />
//                 </Grid>

//                 {/* Rating Information */}
//                 <Grid item xs={12}>
//                   <Controller
//                     name="ratingInfo.isRated"
//                     control={control}
//                     render={({ field }) => (
//                       <FormControlLabel
//                         control={<Checkbox {...field} checked={field.value} />}
//                         label="Is this a rated tournament?"
//                       />
//                     )}
//                   />
//                 </Grid>

//                 {isRated && (
//                   <>
//                     <Grid item xs={12} md={6}>
//                       <Controller
//                         name="ratingInfo.fideEventCode"
//                         control={control}
//                         rules={{
//                           required:
//                             "FIDE event code is required for rated tournaments",
//                         }}
//                         render={({ field }) => (
//                           <TextField
//                             {...field}
//                             label="FIDE Event Code"
//                             fullWidth
//                             error={!!errors.ratingInfo?.fideEventCode}
//                             helperText={
//                               errors.ratingInfo?.fideEventCode?.message
//                             }
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <Controller
//                         name="ratingInfo.fideUrl"
//                         control={control}
//                         rules={{
//                           required:
//                             "FIDE URL is required for rated tournaments",
//                         }}
//                         render={({ field }) => (
//                           <TextField
//                             {...field}
//                             label="FIDE URL"
//                             fullWidth
//                             error={!!errors.ratingInfo?.fideUrl}
//                             helperText={errors.ratingInfo?.fideUrl?.message}
//                           />
//                         )}
//                       />
//                     </Grid>
//                   </>
//                 )}

//                 <Grid item xs={12}>
//                   <Controller
//                     name="ratingInfo.chessResultsUrl"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Chess Results URL"
//                         fullWidth
//                       />
//                     )}
//                   />
//                 </Grid>

//                 {/* Arbiters */}
//                 <Grid item xs={12}>
//                   <Typography variant="h6" gutterBottom>
//                     Arbiters
//                   </Typography>
//                   {arbiterFields.map((field, index) => (
//                     <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
//                       <Grid item xs={12} md={4}>
//                         <Controller
//                           name={`arbiters.${index}.name`}
//                           control={control}
//                           rules={{ required: "Arbiter name is required" }}
//                           render={({ field }) => (
//                             <TextField
//                               {...field}
//                               label="Name"
//                               fullWidth
//                               error={!!errors.arbiters?.[index]?.name}
//                               helperText={
//                                 errors.arbiters?.[index]?.name?.message
//                               }
//                             />
//                           )}
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={4}>
//                         <Controller
//                           name={`arbiters.${index}.fideId`}
//                           control={control}
//                           render={({ field }) => (
//                             <TextField
//                               {...field}
//                               label="FIDE ID (Optional)"
//                               fullWidth
//                             />
//                           )}
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={3}>
//                         <Controller
//                           name={`arbiters.${index}.role`}
//                           control={control}
//                           render={({ field }) => (
//                             <TextField {...field} label="Role" fullWidth />
//                           )}
//                         />
//                       </Grid>
//                       <Grid
//                         item
//                         xs={12}
//                         md={1}
//                         display="flex"
//                         alignItems="center"
//                       >
//                         <IconButton onClick={() => removeArbiter(index)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </Grid>
//                     </Grid>
//                   ))}
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon />}
//                     onClick={() =>
//                       appendArbiter({ name: "", fideId: "", role: "" })
//                     }
//                   >
//                     Add Arbiter
//                   </Button>
//                 </Grid>

//                 {/* Contact Person */}
//                 <Grid item xs={12}>
//                   <Typography variant="h6" gutterBottom>
//                     Contact Person
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="contact.person"
//                     control={control}
//                     rules={{ required: "Contact person is required" }}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Name"
//                         fullWidth
//                         error={!!errors.contact?.person}
//                         helperText={errors.contact?.person?.message}
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="contact.role"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} label="Role" fullWidth />
//                     )}
//                   />
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" gutterBottom>
//                     Emails
//                   </Typography>
//                   {emailFields.map((field, index) => (
//                     <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
//                       <Grid item xs={11}>
//                         <Controller
//                           name={`contact.emails.${index}`}
//                           control={control}
//                           rules={{
//                             required: "Email is required",
//                             pattern: {
//                               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                               message: "Invalid email address",
//                             },
//                           }}
//                           render={({ field }) => (
//                             <TextField
//                               {...field}
//                               label={`Email ${index + 1}`}
//                               fullWidth
//                               error={!!errors.contact?.emails?.[index]}
//                               helperText={
//                                 errors.contact?.emails?.[index]?.message
//                               }
//                             />
//                           )}
//                         />
//                       </Grid>
//                       <Grid item xs={1} display="flex" alignItems="center">
//                         {index > 0 && (
//                           <IconButton onClick={() => removeEmail(index)}>
//                             <DeleteIcon />
//                           </IconButton>
//                         )}
//                       </Grid>
//                     </Grid>
//                   ))}
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon />}
//                     onClick={() => appendEmail("")}
//                     sx={{ mb: 3 }}
//                   >
//                     Add Email
//                   </Button>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" gutterBottom>
//                     Phone Numbers
//                   </Typography>
//                   {phoneFields.map((field, index) => (
//                     <Grid container spacing={2} key={field.id} sx={{ mb: 2 }}>
//                       <Grid item xs={11}>
//                         <Controller
//                           name={`contact.phones.${index}`}
//                           control={control}
//                           rules={{
//                             required: "Phone number is required",
//                             pattern: {
//                               value: /^[0-9+\- ]+$/,
//                               message: "Invalid phone number",
//                             },
//                           }}
//                           render={({ field }) => (
//                             <TextField
//                               {...field}
//                               label={`Phone ${index + 1}`}
//                               fullWidth
//                               error={!!errors.contact?.phones?.[index]}
//                               helperText={
//                                 errors.contact?.phones?.[index]?.message
//                               }
//                             />
//                           )}
//                         />
//                       </Grid>
//                       <Grid item xs={1} display="flex" alignItems="center">
//                         {index > 0 && (
//                           <IconButton onClick={() => removePhone(index)}>
//                             <DeleteIcon />
//                           </IconButton>
//                         )}
//                       </Grid>
//                     </Grid>
//                   ))}
//                   <Button
//                     variant="outlined"
//                     startIcon={<AddIcon />}
//                     onClick={() => appendPhone("")}
//                     sx={{ mb: 3 }}
//                   >
//                     Add Phone
//                   </Button>
//                 </Grid>

//                 {/* Media */}
//                 <Grid item xs={12}>
//                   <Typography variant="h6" gutterBottom>
//                     Media Links
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="media.photosDriveLink"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Photos Drive Link"
//                         fullWidth
//                       />
//                     )}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Controller
//                     name="media.selectedPhotosDriveLink"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Selected Photos Drive Link"
//                         fullWidth
//                       />
//                     )}
//                   />
//                 </Grid>
//               </Grid>

//               <DialogActions sx={{ mt: 3 }}>
//                 <Button onClick={() => setOpen(false)}>Cancel</Button>
//                 <Button type="submit" variant="contained">
//                   Create Tournament
//                 </Button>
//               </DialogActions>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* Create Series Dialog */}
//         <Dialog
//           open={seriesDialogOpen}
//           onClose={() => setSeriesDialogOpen(false)}
//         >
//           <DialogTitle>Create New Series</DialogTitle>
//           <DialogContent>
//             <Controller
//               name="series.seriesName"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Series Name"
//                   fullWidth
//                   sx={{ mt: 2 }}
//                 />
//               )}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setSeriesDialogOpen(false)}>Cancel</Button>
//             <Button onClick={handleAddSeries} variant="contained">
//               Create
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </LocalizationProvider>
//   );
// }
