package com.ems.employee_management_system.Service;


import com.ems.employee_management_system.Entity.Employee;
import com.ems.employee_management_system.Repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    // Constructor Injection (BEST PRACTICE)
    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Employee save(Employee employee) {
        return repository.save(employee);
    }

    // READ ALL
    public List<Employee> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Employee getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    // UPDATE
    public Employee update(Long id, Employee employee) {
        Employee existing = getById(id);

        existing.setEmployeeName(employee.getEmployeeName());
        existing.setDesignation(employee.getDesignation());
        existing.setJoiningDate(employee.getJoiningDate());
        existing.setSalary(employee.getSalary());
        existing.setAddress(employee.getAddress());
        existing.setMobileNo(employee.getMobileNo());
        existing.setGender(employee.getGender());
        existing.setCity(employee.getCity());
        existing.setState(employee.getState());
        existing.setCountry(employee.getCountry());
        existing.setEmployeeType(employee.getEmployeeType());

        return repository.save(existing);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }
}