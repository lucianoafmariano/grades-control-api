import { promises, read } from 'fs';

const gradesFile = './data/grades.json';
const { readFile, writeFile } = promises;

export default {
  async index(_, res) {
    try {
      const data = await readFile(gradesFile);
      const grades = JSON.parse(data);
      res.status(200).json(grades);
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async store(req, res) {
    try {
      const { student, subject, type, value } = req.body;
      const data = await readFile(gradesFile);
      const file = JSON.parse(data);

      const newGrade = {
        id: parseInt(file.nextId),
        student,
        subject,
        type,
        value,
        timestamp: new Date()
      }

      const newFile = {
        nextId: file.nextId + 1,
        grades: [...file.grades, newGrade]
      }

      await writeFile(gradesFile, JSON.stringify(newFile));
      res.status(200).json(newGrade);
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { student, subject, type, value } = req.body;
      const data = await readFile(gradesFile);
      const json = JSON.parse(data);
      const gradeIndex = json.grades.findIndex(grade => grade.id === parseInt(id));
      if(gradeIndex === -1) return res.status(404).json({ error: 'Grade not found' });

      json.grades[gradeIndex] = {
        id: parseInt(id),
        student,
        subject,
        type,
        value,
        timestamp: new Date()
      }

      await writeFile(gradesFile, JSON.stringify(json));
      res.status(200).json(json.grades[gradeIndex]);

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const data = await readFile(gradesFile);
      const json = JSON.parse(data);

      const gradeIndex = json.grades.findIndex(grade => grade.id === parseInt(id));
      if (gradeIndex < 0) return res.status(404).json({ error: 'Grade not found'});
      
      json.grades.splice(gradeIndex, 1);
      await writeFile(gradesFile, JSON.stringify(json));
      
      res.status(200).json({success: `Grade ${id} has been deleted`});

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async findById(req, res) {
    try {
      const { id } = req.params;

      const data = await readFile(gradesFile);
      const json = JSON.parse(data);

      const gradeIndex = json.grades.findIndex(grade => grade.id === parseInt(id));
      if (gradeIndex < 0) return res.status(404).json({ error: 'Grade not found' });

      res.status(200).json(json.grades[gradeIndex]);

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async calculateStudentGrade(req, res) {
    try {
      const { student, subject } = req.body;

      const data = await readFile(gradesFile);
      const json = JSON.parse(data);

      // validando student
      const studentIndex = json.grades.findIndex(grade => grade.student === student);
      if(studentIndex < 0) return res.status(404).json({ error: 'Student not found' });
      const studentData = json.grades.filter(grade => grade.student === student);

      // validando subject
      const subjectIndex = studentData.findIndex(item => item.subject === subject);
      if(subjectIndex < 0) return res.status(400).json({ error: 'Subject not found for this student' });

      const subjectData = studentData.filter(item => item.subject === subject); 
      const grade = subjectData.reduce((accum, item) => accum + item.value, 0);
      res.status(200).json(grade);      
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async calculateAverage(req, res) {
    try {
      const { subject, type } = req.body;
      
      const data = await readFile(gradesFile);
      const json = JSON.parse(data);

      // validando subject
      const subjectIndex = json.grades.findIndex(grade => grade.subject === subject);
      if(subjectIndex < 0) return res.status(404).json({ error: 'Subject not found' });
      const subjectData = json.grades.filter(grade => grade.subject === subject);
      
      // validando type
      const typeIndex = subjectData.findIndex(item => item.type === type);
      if(typeIndex < 0) return res.status(400).json({ error: 'Type not found for this subject' });
      const typeData = subjectData.filter(item => item.type === type);

      // calculando média
      const total = typeData.reduce((accum, currentItem) => accum + currentItem.value, 0);
      const average = total / typeData.length;
      console.log(typeData);
      res.status(200).json(average);

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred.' });
    }
  },

  async findBestGrades(req, res) {
    try {
      const { subject, type } = req.body;
    
      const data = await readFile(gradesFile);
      const json = JSON.parse(data);

      // validando subject
      const subjectIndex = json.grades.findIndex(grade => grade.subject === subject);
      if(subjectIndex < 0) return res.status(404).json({ error: 'Subject not found' });
      const subjectData = json.grades.filter(grade => grade.subject === subject);
      
      // validando type
      const typeIndex = subjectData.findIndex(item => item.type === type);
      if(typeIndex < 0) return res.status(400).json({ error: 'Type not found for this subject' });
      const typeData = subjectData.filter(item => item.type === type);

      const sorted = typeData.sort((a, b) => b.value - a.value);
      const bestGrades = sorted.slice(0, 3);

      res.status(200).json(bestGrades);

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  }
}