package com.paymentgateway.auth.config;

import com.apollographql.federation.graphqljava.Federation;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.TypeDefinitionRegistry;
import org.springframework.boot.autoconfigure.graphql.GraphQlSourceBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FederationConfig {

    @Bean
    public GraphQlSourceBuilderCustomizer federationTransform() {
        return builder -> builder.schemaFactory((TypeDefinitionRegistry registry, RuntimeWiring wiring) ->
                Federation.transform(registry, wiring)
                        .fetchEntities(env -> null)
                        .resolveEntityType(env -> null)
                        .build());
    }
}