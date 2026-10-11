package com.gdg.eventmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.jpa.hibernate.ddl-auto=validate")
@AutoConfigureMockMvc
class EventManagementApplicationTests {

	@Autowired
	private MockMvc mockMvc;


	@Test
	void contextLoads() {
	}

	@Test
	void eventListRemainsPublic() throws Exception {
		mockMvc.perform(get("/api/events"))
				.andExpect(status().isOk());
	}

	@Test
	void registrationEndpointsRequireAuthentication() throws Exception {
		mockMvc.perform(post("/api/registrations/1"))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(get("/api/registrations/me"))
				.andExpect(status().isUnauthorized());
	}

}
