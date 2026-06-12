package com.ems.employee_management_system.Controller;


import com.ems.employee_management_system.Entity.Employee;
import com.ems.employee_management_system.Service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin("*") // allow frontend
public class EmployeeController {

    @Autowired
    private final EmployeeService service;

    //private EmployeeService employeeService;

    //private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Employee create(@RequestBody Employee employee) {
        return service.save(employee);
    }

    // READ ALL
    @GetMapping
    public List<Employee> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Employee getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id,
                           @RequestBody Employee employee) {
        return service.update(id, employee);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Employee Deleted Successfully";
    }
}