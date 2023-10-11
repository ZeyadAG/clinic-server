const updateDoctorInfo = async (req, res) => {
    try {
        const { email, hourly_rate, affiliated_hospital } = req.body;

        const doctorID = req.params.id; // get the doctor id then search for it

        const doctor = await Doctor.findById(doctorID); //return if the doctor exists or not

        if (email) {
            doctor.email = email;
        }

        if (hourly_rate) {
            doctor.hourly_rate = hourly_rate;
        }

        if (affiliated_hospital) {
            doctor.affiliated_hospital = affiliated_hospital;
        }

        return res.status(404).json({ message: "Doctor does not exist" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const registerNewDoctor = async (req, res) => {
    try {
        const {
            username,
            password,
            name,
            email,
            date_of_birth,
            hourly_rate,
            affiliated_hospital,
            educational_background,
            appointment_slots,
        } = req.body;

        const doctor = new Doctor({
            name,
            email,
            date_of_birth,
            hourly_rate,
            affiliated_hospital,
            educational_background,
            appointment_slots,
        });
        const user = new User({
            username,
            password,
            doctor: doctor._id,
        });
        await doctor.save();
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// FRONTEND
export const change_doctor_status = (id, status) => {
    fetch(API_URL + "/admin/changeDoctorStatus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            doctor_id: id,
            status: status,
        }),
    });
};

export const delete_patient = (id) => {
    fetch(API_URL + "/admin/deletePatient", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            patient_id: id,
        }),
    });
};

export const delete_doctor = (id) => {
    fetch(API_URL + "/admin/deleteDoctor", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            doctor_id: id,
        }),
    });
};

export const get_admin_data = () => {
    return fetch(API_URL + "/admin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
};

//
const updatePackage = async (req, res) => {
    try {
        const {
            name,
            price,
            doctor_sessions_discount,
            medicine_discount,
            subscription_discount,
        } = req.body;

        const packageID = req.params.id;

        const pack = await Package.findById(packageID);

        if (name) {
            packageID.name = name;
        }
        if (price) {
            packageID.price = price;
        }
        if (doctor_sessions_discount) {
            packageID.doctor_sessions_discount = doctor_sessions_discount;
        }
        if (medicine_discount) {
            packageID.medicine_discount = medicine_discount;
        }
        if (subscription_discount) {
            packageID.subscription_discount = subscription_discount;
        }

        await pack.save();

        return res.status(200).json(pack);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const deletePackage = async (req, res) => {
    try {
        const packageID = req.params.id;
        await Package.findByIdAndDelete(packageID);
        return res
            .status(200)
            .json({ message: "package deleted successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userID = req.params.userID;
        await User.findByIdAndDelete(userID);
        return res.status(200).json({ message: "user deleted successfully" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const addNewPackage = async (req, res) => {
    try {
        const {
            name,
            price,
            doctor_sessions_discount,
            medicin_discount,
            subscription_discount,
        } = req.body;

        const pack = new Package({
            name,
            price,
            doctor_sessions_discount,
            medicin_discount,
            subscription_discount,
        });
        await pack.save();
        return res.status(201).json(pack);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};
