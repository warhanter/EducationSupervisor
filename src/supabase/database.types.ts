export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      absences: {
        Row: {
          absence_status: boolean | null
          class_abbreviation: string | null
          class_level: string | null
          class_name: string | null
          class_number: number | null
          created_at: string | null
          date_of_absence: string
          date_of_return: string | null
          first_name: string | null
          full_class_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          justified_missed_hours: number | null
          last_name: string | null
          medical_leave: boolean | null
          missed_hours: number | null
          student_id: number | null
          student_status: string | null
          supervisor_id: string | null
          trimester: string | null
          updated_at: string | null
        }
        Insert: {
          absence_status?: boolean | null
          class_abbreviation?: string | null
          class_level?: string | null
          class_name?: string | null
          class_number?: number | null
          created_at?: string | null
          date_of_absence: string
          date_of_return?: string | null
          first_name?: string | null
          full_class_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          justified_missed_hours?: number | null
          last_name?: string | null
          medical_leave?: boolean | null
          missed_hours?: number | null
          student_id?: number | null
          student_status?: string | null
          supervisor_id?: string | null
          trimester?: string | null
          updated_at?: string | null
        }
        Update: {
          absence_status?: boolean | null
          class_abbreviation?: string | null
          class_level?: string | null
          class_name?: string | null
          class_number?: number | null
          created_at?: string | null
          date_of_absence?: string
          date_of_return?: string | null
          first_name?: string | null
          full_class_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          justified_missed_hours?: number | null
          last_name?: string | null
          medical_leave?: boolean | null
          missed_hours?: number | null
          student_id?: number | null
          student_status?: string | null
          supervisor_id?: string | null
          trimester?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "absences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absences_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string | null
          end_date: string | null
          event_type: string | null
          id: string
          name: string | null
          school_id: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          name?: string | null
          school_id?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          name?: string | null
          school_id?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      class_programs: {
        Row: {
          classroom_id: string | null
          created_at: string | null
          day: string
          hour: number
          id: string
          professor_id: string | null
          updated_at: string | null
        }
        Insert: {
          classroom_id?: string | null
          created_at?: string | null
          day: string
          hour: number
          id?: string
          professor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          classroom_id?: string | null
          created_at?: string | null
          day?: string
          hour?: number
          id?: string
          professor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_programs_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_programs_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_professors: {
        Row: {
          classroom_id: string
          created_at: string | null
          is_head_professor: boolean | null
          professor_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string | null
          is_head_professor?: boolean | null
          professor_id: string
        }
        Update: {
          classroom_id?: string
          created_at?: string | null
          is_head_professor?: boolean | null
          professor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_professors_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_professors_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_supervisors: {
        Row: {
          classroom_id: string
          created_at: string | null
          is_primary: boolean | null
          supervisor_id: string
        }
        Insert: {
          classroom_id: string
          created_at?: string | null
          is_primary?: boolean | null
          supervisor_id: string
        }
        Update: {
          classroom_id?: string
          created_at?: string | null
          is_primary?: boolean | null
          supervisor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classroom_supervisors_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classroom_supervisors_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          class_full_name: string
          class_level: string
          class_name: string
          class_number: number
          class_prefix: string | null
          created_at: string | null
          head_professor_id: string | null
          id: string
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          class_full_name: string
          class_level: string
          class_name: string
          class_number: number
          class_prefix?: string | null
          created_at?: string | null
          head_professor_id?: string | null
          id?: string
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class_full_name?: string
          class_level?: string
          class_name?: string
          class_number?: number
          class_prefix?: string | null
          created_at?: string | null
          head_professor_id?: string | null
          id?: string
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classrooms_head_professor_id_fkey"
            columns: ["head_professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classrooms_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_notes: {
        Row: {
          created_at: string
          id: string
          lunch_note: string | null
          lunch_plates: string | null
          note: string | null
          report_date: string
          report_number: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          lunch_note?: string | null
          lunch_plates?: string | null
          note?: string | null
          report_date: string
          report_number?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          lunch_note?: string | null
          lunch_plates?: string | null
          note?: string | null
          report_date?: string
          report_number?: number | null
        }
        Relationships: []
      }
      leave_certifications: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          leave_days: number
          reason: string | null
          start_date: string
          student_id: number | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          leave_days: number
          reason?: string | null
          start_date: string
          student_id?: number | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          leave_days?: number
          reason?: string | null
          start_date?: string
          student_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      lunch_absences: {
        Row: {
          absence_date: string
          created_at: string | null
          id: string
          student_id: number | null
          updated_at: string | null
        }
        Insert: {
          absence_date: string
          created_at?: string | null
          id?: string
          student_id?: number | null
          updated_at?: string | null
        }
        Update: {
          absence_date?: string
          created_at?: string | null
          id?: string
          student_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lunch_absences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lunch_absences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      professor_absences: {
        Row: {
          absence_date: string
          created_at: string | null
          full_class_name: string
          id: string
          is_justified: boolean | null
          professor_id: string | null
          reason: string | null
        }
        Insert: {
          absence_date: string
          created_at?: string | null
          full_class_name: string
          id?: string
          is_justified?: boolean | null
          professor_id?: string | null
          reason?: string | null
        }
        Update: {
          absence_date?: string
          created_at?: string | null
          full_class_name?: string
          id?: string
          is_justified?: boolean | null
          professor_id?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professor_absences_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          created_at: string | null
          first_name: string
          full_name: string
          id: string
          is_absent: boolean | null
          isti9bal_time: string | null
          last_name: string
          subject_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          full_name: string
          id?: string
          is_absent?: boolean | null
          isti9bal_time?: string | null
          last_name: string
          subject_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          full_name?: string
          id?: string
          is_absent?: boolean | null
          isti9bal_time?: string | null
          last_name?: string
          subject_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professors_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      sanctions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          reason: string | null
          sanction_date: string
          sanction_from_professor_id: string | null
          sanction_from_supervisor_id: string | null
          sanction_name: string
          severity_level: number | null
          student_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          sanction_date: string
          sanction_from_professor_id?: string | null
          sanction_from_supervisor_id?: string | null
          sanction_name: string
          severity_level?: number | null
          student_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string | null
          sanction_date?: string
          sanction_from_professor_id?: string | null
          sanction_from_supervisor_id?: string | null
          sanction_name?: string
          severity_level?: number | null
          student_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sanctions_sanction_from_professor_id_fkey"
            columns: ["sanction_from_professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_sanction_from_supervisor_id_fkey"
            columns: ["sanction_from_supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          academic_year: string
          app_version: string
          created_at: string | null
          evening_timing: string | null
          id: string
          school_baladiya: string | null
          school_level: string | null
          school_name: string
          school_wilaya: string | null
          tuesday_evening: boolean | null
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          app_version: string
          created_at?: string | null
          evening_timing?: string | null
          id?: string
          school_baladiya?: string | null
          school_level?: string | null
          school_name: string
          school_wilaya?: string | null
          tuesday_evening?: boolean | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          app_version?: string
          created_at?: string | null
          evening_timing?: string | null
          id?: string
          school_baladiya?: string | null
          school_level?: string | null
          school_name?: string
          school_wilaya?: string | null
          tuesday_evening?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_addresses: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_birth: string
          father_name: string | null
          first_name: string
          full_name: string
          id: string
          last_name: string
          phone_number: string | null
          student_id: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_birth: string
          father_name?: string | null
          first_name: string
          full_name: string
          id?: string
          last_name: string
          phone_number?: string | null
          student_id?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string
          father_name?: string | null
          first_name?: string
          full_name?: string
          id?: string
          last_name?: string
          phone_number?: string | null
          student_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_addresses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_addresses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          absence_date: string | null
          class_abbreviation: string | null
          class_name: string | null
          class_number: number | null
          class_prefix: string | null
          classroom_id: string | null
          created_at: string | null
          deleted: boolean | null
          fathers_name: string | null
          first_name: string
          full_class_name: string | null
          full_name: string
          gender: string | null
          i3ada: boolean | null
          id: number
          idmaj: boolean | null
          is_absent: boolean | null
          is_fired: boolean | null
          is_mamnouh: boolean | null
          is_new: boolean | null
          key: string | null
          last_name: string
          level: string | null
          lunch_absence: boolean | null
          lunch_absence_justification: boolean | null
          lunch_absence_justification_name: string | null
          lunch_justification_date: string | null
          lunch_paid: boolean | null
          lunch_table_number: number | null
          mandoub: boolean | null
          mandoub_name: string | null
          medical_leave: boolean | null
          medical_leave_end_date: string | null
          medical_leave_start_date: string | null
          mo3waz: boolean | null
          prev_class_name: string | null
          prev_class_number: number | null
          rakm_tasjil: number | null
          sick: boolean | null
          sickness: string | null
          sport_inapt: boolean | null
          student_address: string | null
          student_dob: string | null
          student_doi: string | null
          student_inscription_date: string | null
          student_leave_date: string | null
          student_pob: string | null
          student_status: string
          supervisor_id: string | null
          switched_school: boolean | null
          ta7wil_dakhili: boolean | null
          ta7wil_dakhili_date: string | null
          table_chair_number: number | null
          updated_at: string | null
          yatim: boolean | null
          yatim_name: string | null
        }
        Insert: {
          absence_date?: string | null
          class_abbreviation?: string | null
          class_name?: string | null
          class_number?: number | null
          class_prefix?: string | null
          classroom_id?: string | null
          created_at?: string | null
          deleted?: boolean | null
          fathers_name?: string | null
          first_name: string
          full_class_name?: string | null
          full_name: string
          gender?: string | null
          i3ada?: boolean | null
          id?: number
          idmaj?: boolean | null
          is_absent?: boolean | null
          is_fired?: boolean | null
          is_mamnouh?: boolean | null
          is_new?: boolean | null
          key?: string | null
          last_name: string
          level?: string | null
          lunch_absence?: boolean | null
          lunch_absence_justification?: boolean | null
          lunch_absence_justification_name?: string | null
          lunch_justification_date?: string | null
          lunch_paid?: boolean | null
          lunch_table_number?: number | null
          mandoub?: boolean | null
          mandoub_name?: string | null
          medical_leave?: boolean | null
          medical_leave_end_date?: string | null
          medical_leave_start_date?: string | null
          mo3waz?: boolean | null
          prev_class_name?: string | null
          prev_class_number?: number | null
          rakm_tasjil?: number | null
          sick?: boolean | null
          sickness?: string | null
          sport_inapt?: boolean | null
          student_address?: string | null
          student_dob?: string | null
          student_doi?: string | null
          student_inscription_date?: string | null
          student_leave_date?: string | null
          student_pob?: string | null
          student_status?: string
          supervisor_id?: string | null
          switched_school?: boolean | null
          ta7wil_dakhili?: boolean | null
          ta7wil_dakhili_date?: string | null
          table_chair_number?: number | null
          updated_at?: string | null
          yatim?: boolean | null
          yatim_name?: string | null
        }
        Update: {
          absence_date?: string | null
          class_abbreviation?: string | null
          class_name?: string | null
          class_number?: number | null
          class_prefix?: string | null
          classroom_id?: string | null
          created_at?: string | null
          deleted?: boolean | null
          fathers_name?: string | null
          first_name?: string
          full_class_name?: string | null
          full_name?: string
          gender?: string | null
          i3ada?: boolean | null
          id?: number
          idmaj?: boolean | null
          is_absent?: boolean | null
          is_fired?: boolean | null
          is_mamnouh?: boolean | null
          is_new?: boolean | null
          key?: string | null
          last_name?: string
          level?: string | null
          lunch_absence?: boolean | null
          lunch_absence_justification?: boolean | null
          lunch_absence_justification_name?: string | null
          lunch_justification_date?: string | null
          lunch_paid?: boolean | null
          lunch_table_number?: number | null
          mandoub?: boolean | null
          mandoub_name?: string | null
          medical_leave?: boolean | null
          medical_leave_end_date?: string | null
          medical_leave_start_date?: string | null
          mo3waz?: boolean | null
          prev_class_name?: string | null
          prev_class_number?: number | null
          rakm_tasjil?: number | null
          sick?: boolean | null
          sickness?: string | null
          sport_inapt?: boolean | null
          student_address?: string | null
          student_dob?: string | null
          student_doi?: string | null
          student_inscription_date?: string | null
          student_leave_date?: string | null
          student_pob?: string | null
          student_status?: string
          supervisor_id?: string | null
          switched_school?: boolean | null
          ta7wil_dakhili?: boolean | null
          ta7wil_dakhili_date?: string | null
          table_chair_number?: number | null
          updated_at?: string | null
          yatim?: boolean | null
          yatim_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string
          id: number
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      supervisors: {
        Row: {
          created_at: string | null
          first_name: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          supervisor_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          supervisor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          supervisor_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      class_roster: {
        Row: {
          class_full_name: string | null
          class_level: string | null
          current_absences: number | null
          female_students: number | null
          male_students: number | null
          total_students: number | null
        }
        Relationships: []
      }
      daily_attendance: {
        Row: {
          class_name: string | null
          class_number: number | null
          date_of_absence: string | null
          justified_absences: number | null
          total_absences: number | null
          unjustified_absences: number | null
        }
        Relationships: []
      }
      student_details: {
        Row: {
          absence_date: string | null
          address: string | null
          class_abbreviation: string | null
          class_name: string | null
          class_number: number | null
          class_prefix: string | null
          classroom_id: string | null
          created_at: string | null
          current_class_full_name: string | null
          current_class_level: string | null
          deleted: boolean | null
          fathers_name: string | null
          first_name: string | null
          full_class_name: string | null
          full_name: string | null
          gender: string | null
          i3ada: boolean | null
          id: number | null
          idmaj: boolean | null
          is_absent: boolean | null
          is_fired: boolean | null
          is_mamnouh: boolean | null
          is_new: boolean | null
          key: string | null
          last_name: string | null
          level: string | null
          lunch_absence: boolean | null
          lunch_absence_justification: boolean | null
          lunch_absence_justification_name: string | null
          lunch_justification_date: string | null
          lunch_paid: boolean | null
          lunch_table_number: number | null
          mandoub: boolean | null
          mandoub_name: string | null
          medical_leave: boolean | null
          medical_leave_end_date: string | null
          medical_leave_start_date: string | null
          mo3waz: boolean | null
          phone_number: string | null
          prev_class_name: string | null
          prev_class_number: number | null
          rakm_tasjil: number | null
          sick: boolean | null
          sickness: string | null
          sport_inapt: boolean | null
          student_address: string | null
          student_dob: string | null
          student_doi: string | null
          student_inscription_date: string | null
          student_leave_date: string | null
          student_pob: string | null
          student_status: string | null
          supervisor_id: string | null
          supervisor_name: string | null
          switched_school: boolean | null
          ta7wil_dakhili: boolean | null
          ta7wil_dakhili_date: string | null
          table_chair_number: number | null
          updated_at: string | null
          yatim: boolean | null
          yatim_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      "insert classrooms": { Args: never; Returns: Record<string, unknown> }
      populate_classrooms_from_students: { Args: never; Returns: number }
    }
    Enums: {
      gender: "ذكر" | "أنثى"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender: ["ذكر", "أنثى"],
    },
  },
} as const
