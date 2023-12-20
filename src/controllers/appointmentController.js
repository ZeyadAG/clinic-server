const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Chat = require("../models/Chat");

const nodemailer = require("nodemailer");

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const { Types } = require("mongoose");

const handleAppointmentCardPayment = async (req, res) => {
    try {
        const { payment_name, payment_amount } = req.body;
        const { patient_id, doctor_id, timeslot_id } = req.body;

        //Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: payment_name,
                        },
                        unit_amount: payment_amount * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: `http://localhost:5173/appointmentSuccessPayment/${patient_id}/${doctor_id}/${timeslot_id}`,
            cancel_url: `http://localhost:5173/cancel`,
        });

        res.json({ url: session.url });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const { patientID } = req.params;
        const patient = await Patient.findById(patientID).populate({
            path: "appointments",
            populate: { path: "doctor", populate: { path: "user" } },
        });

        const appointments = patient.appointments;

        return res.status(200).json(appointments);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorID } = req.params;
        const doctor = await Doctor.findById(doctorID).populate({
            path: "appointments",
            populate: { path: "patient", populate: { path: "user" } },
        });

        const appointments = doctor.appointments;

        return res.status(200).json(appointments);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const addNewAppointment = async (req, res) => {
    try {
        const { patientID } = req.params;
        const doctorID = req.body.doctor_id;
        const timeslotID = req.body.time_slot;

        const [patient, doctor, patientUser, doctorUser] = await Promise.all([
            Patient.findById(patientID),
            Doctor.findById(doctorID),
            User.findOne({ patient: patientID }),
            User.findOne({ doctor: doctorID }),
        ]);

        const timeslotIndex = doctor.appointments_time_slots.findIndex(
            (slot) => slot._id == timeslotID
        );

        const timeslot = doctor.appointments_time_slots[timeslotIndex];

        if (timeslot.status === "reserved") {
            doctor.appointments_time_slots[timeslotIndex].status = "reserved";
            return res.status(200).json({ message: "already reserved" });
        }

        doctor.appointments_time_slots[timeslotIndex].status = "reserved";

        const appointment = new Appointment({
            doctor: doctorID,
            patient: patientID,
            time_slot: {
                start_time: timeslot.start_time,
                end_time: timeslot.end_time,
            },
        });

        await appointment.save();

        doctor.appointments.push(appointment._id);
        patient.appointments.push(appointment._id);

        const patientNotification = {
            type: "new appointment",
            description: `You have set a new appointment with Dr. ${
                doctorUser.name
            } on ${appointment.time_slot.start_time.toLocaleString()}`,
            appointment: appointment._id,
            time_of_notification: new Date(),
        };

        const doctorNotification = {
            type: "new appointment",
            description: `You have a new appointment with the patient ${
                patientUser.name
            } on ${appointment.time_slot.start_time.toLocaleString()}`,
            appointment: appointment._id,
            time_of_notification: new Date(),
        };

        doctorUser.notifications.push(doctorNotification);
        patientUser.notifications.push(patientNotification);

        sendMail(
            patientUser.email,
            "New Appointment",
            `You have set a new appointment with Dr. ${
                doctorUser.name
            } on ${appointment.time_slot.start_time.toLocaleString()}`
        );
        sendMail(
            doctorUser.email,
            "New Appointment",
            `You have a new appointment with the patient ${
                patientUser.name
            } on ${appointment.time_slot.start_time.toLocaleString()}`
        );

        const chatsFound = await Chat.find({
            $and: [
                { first_user: patientUser._id },
                { second_user: doctorUser._id },
            ],
        });

        let chat;
        if (chatsFound.length == 0) {
            chat = new Chat({
                first_user: patientUser._id,
                second_user: doctorUser._id,
                messages: [],
            });

            await chat.save();
        }

        await Promise.all([
            patient.save(),
            doctor.save(),
            patientUser.save(),
            doctorUser.save(),
        ]);

        return res.status(200).json({ appointment });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const getPatientFollowUpRequests = async (req, res) => {
    try {
        const { patientID } = req.params;
        const patient = await Patient.findById(patientID).populate({
            path: "follow_up_requests",
            populate: { path: "doctor", populate: { path: "user" } },
        });

        return res.status(200).json(patient.follow_up_requests);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getDoctorFollowUpRequests = async (req, res) => {
    try {
        const { doctorID } = req.params;
        const doctor = await Doctor.findById(doctorID).populate({
            path: "follow_up_requests",
            populate: { path: "patient", populate: { path: "user" } },
        });

        return res.status(200).json(doctor.follow_up_requests);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const requestFollowUp = async (req, res) => {
    try {
        const { patientID, doctorID } = req.params;
        const timeslotID = req.body.time_slot;
        const requester = req.body.requester;

        const [patient, doctor] = await Promise.all([
            Patient.findById(patientID),
            Doctor.findById(doctorID),
        ]);

        const timeslotIndex = doctor.appointments_time_slots.findIndex(
            (slot) => slot._id == timeslotID
        );

        const timeslot = doctor.appointments_time_slots[timeslotIndex];

        if (timeslot.status === "reserved") {
            doctor.appointments_time_slots[timeslotIndex].status = "reserved";
            return res.status(200).json({ message: "already reserved" });
        }

        doctor.appointments_time_slots[timeslotIndex].status = "reserved";

        const appointment = new Appointment({
            doctor: doctorID,
            patient: patientID,
            time_slot: {
                start_time: timeslot.start_time,
                end_time: timeslot.end_time,
            },
            follow_up: "pending",
        });

        if (requester === "patient") {
            doctor.follow_up_requests.push(appointment);
        } else {
            patient.follow_up_requests.push(appointment);
        }

        await appointment.save();

        doctor.appointments.push(appointment._id);
        patient.appointments.push(appointment._id);

        await Promise.all([patient.save(), doctor.save()]);

        return res.status(200).json({ appointment });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const handleFollowUp = async (req, res) => {
    try {
        const { id } = req.params;
        const { approval } = req.body;

        const appointment = await Appointment.findById(id);

        appointment.follow_up = approval;

        await appointment.save();

        return res.status(200).json({ appointment });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(
            "🚀 ~ file: appointmentController.js:289 ~ rescheduleAppointment ~ id:",
            id
        );

        const doctorID = req.body.doctor_id;
        console.log(
            "🚀 ~ file: appointmentController.js:291 ~ rescheduleAppointment ~ doctorID:",
            doctorID
        );
        const patientID = req.body.patient_id;
        console.log(
            "🚀 ~ file: appointmentController.js:293 ~ rescheduleAppointment ~ patientID:",
            patientID
        );
        const timeslotID = req.body.time_slot;
        console.log(
            "🚀 ~ file: appointmentController.js:295 ~ rescheduleAppointment ~ timeslotID:",
            timeslotID
        );
        const oldStartTime = req.body.old_start_time;
        console.log(
            "🚀 ~ file: appointmentController.js:297 ~ rescheduleAppointment ~ oldStartTime:",
            oldStartTime
        );
        const oldEndTime = req.body.old_end_time;
        console.log(
            "🚀 ~ file: appointmentController.js:299 ~ rescheduleAppointment ~ oldEndTime:",
            oldEndTime
        );

        const [appointment, doctor, patient] = await Promise.all([
            Appointment.findById(id),
            Doctor.findById(doctorID),
            Patient.findById(patientID),
        ]);

        const [patientUser, doctorUser] = await Promise.all([
            User.findOne({ patient: appointment.patient }),
            User.findOne({ doctor: doctorID }),
        ]);

        const timeslotIndex = doctor.appointments_time_slots.findIndex(
            (slot) => slot._id == timeslotID
        );

        const oldTimeslotIndex = doctor.appointments_time_slots.findIndex(
            (slot) =>
                new Date(slot.start_time).toISOString() ==
                    new Date(oldStartTime).toISOString() &&
                new Date(slot.end_time).toISOString() ==
                    new Date(oldEndTime).toISOString()
        );

        console.log(
            "🚀 ~ file: appointmentController.js:340 ~ rescheduleAppointment ~ oldTimeslotIndex:",
            oldTimeslotIndex
        );

        doctor.appointments_time_slots[timeslotIndex].status = "reserved";
        console.log(
            "🚀 ~ file: appointmentController.js:323 ~ rescheduleAppointment ~ doctor.appointments_time_slots[timeslotIndex]:",
            doctor.appointments_time_slots[timeslotIndex]
        );

        doctor.appointments_time_slots[oldTimeslotIndex].status = "available";
        console.log(
            "🚀 ~ file: appointmentController.js:325 ~ rescheduleAppointment ~ doctor.appointments_time_slots[oldTimeslotIndex]:",
            doctor.appointments_time_slots[oldTimeslotIndex]
        );

        appointment.status = "rescheduled";

        const newAppointment = new Appointment({
            doctor: doctorID,
            patient: patientID,
            time_slot: {
                start_time:
                    doctor.appointments_time_slots[timeslotIndex].start_time,
                end_time:
                    doctor.appointments_time_slots[timeslotIndex].end_time,
            },
        });

        await newAppointment.save();

        doctor.appointments.push(newAppointment._id);
        patient.appointments.push(newAppointment._id);

        const patientNotification = {
            type: "rescheduled appointment",
            description: `You have a rescheduled appointment with Dr. ${doctorUser.name}`,
            appointment: appointment._id,
            time_of_notification: new Date(),
        };

        const doctorNotification = {
            type: "rescheduled appointment",
            description: `You have a rescheduled appointment with the patient ${patientUser.name}`,
            appointment: appointment._id,
            time_of_notification: new Date(),
        };

        doctorUser.notifications.push(doctorNotification);
        patientUser.notifications.push(patientNotification);

        sendMail(
            patientUser.email,
            "Rescheduled Appointment",
            `You have a rescheduled appointment with Dr. ${doctorUser.name}`
        );
        sendMail(
            doctorUser.email,
            "Rescheduled Appointment",
            `You have a rescheduled appointment with the patient ${patientUser.name}`
        );

        await Promise.all([
            appointment.save(),
            doctor.save(),
            patient.save(),
            patientUser.save(),
            doctorUser.save(),
        ]);

        return res.status(200).json({ appointment });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorID = req.body.doctor_id;
        const patientID = req.body.patient_id;
        const oldStartTime = req.body.old_start_time;
        const oldEndTime = req.body.old_end_time;

        const [appointment, doctor, patient, patientUser, doctorUser] =
            await Promise.all([
                Appointment.findById(id),
                Doctor.findById(doctorID),
                Patient.findById(patientID).populate({
                    path: "package.package_info",
                }),
                User.findOne({ patient: patientID }),
                User.findOne({ doctor: doctorID }),
            ]);

        const timeslotIndex = doctor.appointments_time_slots.findIndex(
            (slot) =>
                new Date(slot.start_time).toISOString() ==
                    new Date(oldStartTime).toISOString() &&
                new Date(slot.end_time).toISOString() ==
                    new Date(oldEndTime).toISOString()
        );

        doctor.appointments_time_slots[timeslotIndex].status = "available";
        appointment.status = "cancelled";

        let priceToRefund;
        const slotPrice = doctor.appointments_time_slots[timeslotIndex].price;

        if (patient.package.status == "subscribed") {
            const discount =
                patient.package.package_info.doctor_sessions_discount;
            priceToRefund = (1 - discount) * slotPrice + slotPrice * 0.1;
        } else {
            priceToRefund = slotPrice * 1.1;
        }

        patient.wallet_amount += priceToRefund;

        const patientNotification = {
            type: "cancelled appointment",
            description: `You have a cancelled appointment with Dr. ${doctorUser.name}`,
            appointment: appointment._id,
            time_of_notification: new Date(),
        };

        const doctorNotification = {
            type: "cancelled appointment",
            description: `You have a cancelled appointment with the patient ${patientUser.name}`,
            appointment: appointment._id,
            time_of_notification: new Date(),
        };

        doctorUser.notifications.push(doctorNotification);
        patientUser.notifications.push(patientNotification);

        sendMail(
            patientUser.email,
            "Cancelled Appointment",
            `You have a cancelled appointment with Dr. ${doctorUser.name}`
        );
        sendMail(
            doctorUser.email,
            "Cancelled Appointment",
            `You have a cancelled appointment with the patient ${patientUser.name}`
        );

        await Promise.all([
            appointment.save(),
            doctor.save(),
            patient.save(),
            patientUser.save(),
            doctorUser.save(),
        ]);

        return res.status(200).json({ appointment });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
};

const sendMail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "seifkandel3@gmail.com",
            pass: "c x o d r z b m d n u s y f p r",
        },
    });

    const mailOptions = {
        from: "seifkandel3@gmail.com",
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions);
};

module.exports = {
    handleAppointmentCardPayment,
    getPatientAppointments,
    getDoctorAppointments,
    addNewAppointment,
    getPatientFollowUpRequests,
    getDoctorFollowUpRequests,
    requestFollowUp,
    handleFollowUp,
    rescheduleAppointment,
    cancelAppointment,
};
